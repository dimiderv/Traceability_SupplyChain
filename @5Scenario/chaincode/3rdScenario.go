package chaincode

import (
  "encoding/json"
  "fmt"
  "log"
  "encoding/base64"
  "github.com/hyperledger/fabric-contract-api-go/contractapi"
  "time"
  "strings"
  "github.com/golang/protobuf/ptypes"
  "math"
  "strconv"


  
)

type SmartContract struct {
  contractapi.Contract
}

type Asset struct {
  ID             string  	 `json:"ID"`	
  AssetType 	 string      `json:"assetType"`
  Weight         int         `json:"weight"`
  Owner          string      `json:"owner"`
  OwnerOrg       string      `json:"ownerOrg"`
  Timestamp      time.Time 	 `json:"timestamp"`
  Creator        string 	 `json:"creator"`
  ExpirationDate time.Time   `json:"expirationDate"`
  SensorData 	 string		 `json:"sensorData"`	
  
}



// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	
	
	temp := ctx.GetClientIdentity().AssertAttributeValue("retailer", "true")
	if temp==nil {
		return fmt.Errorf("submitting client not authorized to create asset, he is a Retailer")
	}

	err := ctx.GetClientIdentity().AssertAttributeValue("farmer", "true")
	if err != nil {
		return fmt.Errorf("submitting client not authorized to create asset, he is not a Farmer")
	}	

	timeS,err:= ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return  err
	}
	timestamp, err := ptypes.Timestamp(timeS)
	if err != nil {
		return err
	}
	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}
	creatorDN, err:=s.GetSubmittingClientDN(ctx)
	if err != nil {
		return err
	}
	expirationDate := timestamp.AddDate(0,0,7)

	//in case a user from other org has the same name , cause they have different CAs that might happen
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}


	assets := []Asset{
		{ID: "asset1",  AssetType:"berries", Weight: 15,  Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate.AddDate(0,0,-7)},
		{ID: "asset2",  AssetType:"oranges", Weight: 20,  Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate.AddDate(0,0,-6)},
		{ID: "asset3",  AssetType:"apples",  Weight: 17, Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate.AddDate(0,0,-2)},
		{ID: "asset4",  AssetType:"bananas",  Weight: 23, Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate.AddDate(0,0,-1)},
		{ID: "asset5",  AssetType:"tomatoes",  Weight: 25, Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate},
		{ID: "asset6",  AssetType:"grapes",  Weight: 15, Owner: clientID, OwnerOrg:clientOrgID, Timestamp: timestamp, Creator: creatorDN, SensorData:"", ExpirationDate:expirationDate},
	  }
  for _, asset := range assets {
    assetJSON, err := json.Marshal(asset)
    if err != nil {
      return err
    }

    err = ctx.GetStub().PutState(asset.ID, assetJSON)
    if err != nil {
      return fmt.Errorf("failed to put to world state. %v", err)
    }
  }

  return nil
}

// CreateAsset issues a new asset to the world state with given details 
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, weight int,assetType string) error {
//objectType strings,

	//check if asset already exists
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the asset %s already exists", id)
	}
	//get clientOrgID only client with Org1MSP can create assets
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}
	if clientOrgID != "Org1MSP"{
		return fmt.Errorf("submitting client not authorized to create asset, not a member of Org1")
	}
	
	//Access Control only farmers can createAssets
	temp := ctx.GetClientIdentity().AssertAttributeValue("retailer", "true")
	if temp==nil {
		return fmt.Errorf("submitting client not authorized to create asset, he is a Retailer")
	}

	farmer := ctx.GetClientIdentity().AssertAttributeValue("farmer", "true")
	if farmer != nil {
		return fmt.Errorf("submitting client not authorized to create asset, he is not a Farmer")
	}
	
	// Get ID of submitting client identity
	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	creatorDN, err:=s.GetSubmittingClientDN(ctx)
	if err != nil {
		return err
	}

	//Get timestamp 	
	txTimestamp, error := ctx.GetStub().GetTxTimestamp()
	if error != nil {
		return  error
	}
	timestamp, erri := ptypes.Timestamp(txTimestamp)
	if erri != nil {
		return  erri
	}
	//add expiration date
	expirationDate := timestamp.AddDate(0,0,7)


	// Verify that the client is submitting request to peer in their organization
	// This is to ensure that a client from another org doesn't attempt to read or
	// write private data from this peer.
	err = verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return fmt.Errorf("CreateAsset cannot be performed: Error %v", err)
	}

	// Make submitting client the owner
	asset := Asset{
		ID:    			id,
		AssetType:		assetType,
		Weight:  		weight,
		Owner: 			clientID,
		OwnerOrg:		clientOrgID,
		Timestamp:  	timestamp,
		Creator: 		creatorDN,
		ExpirationDate:	expirationDate,
		SensorData: 	""}

	assetJSONasBytes, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("failed to marshal asset into JSON: %v", err)
	}

	

	err = ctx.GetStub().PutState(id, assetJSONasBytes)//puts data in public
	if err != nil {
		return fmt.Errorf("failed to put asset into private data collecton: %v", err)
	}
	
	return nil

}

//Returns a string with the remaining time that the product can be consumed
func (s *SmartContract) ExpiresIn( ctx contractapi.TransactionContextInterface , id string) (string,error){
	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return "",err
	}
	productionDate := asset.ExpirationDate.AddDate(0,0,-7)
	onChainTime := time.Since(productionDate) //float64
	
	remainingTime := 7*24 -onChainTime.Hours()
	dayLeft := int(math.Floor((remainingTime)/24)) 
	hoursLeft := int(math.Mod(remainingTime,24))
	minutesLeft :=int( ( math.Mod(remainingTime,24) - math.Floor( math.Mod(remainingTime,24) ) ) *60)

	if onChainTime.Hours()/24 <=0 || remainingTime <=0{
		return "Product has expired",nil
	}

	dayString := strconv.Itoa(dayLeft)
	hourString := strconv.Itoa(hoursLeft)
	minutesString := strconv.Itoa(minutesLeft)
	
	timeToExpiration:="Product expires in "+dayString+" days, "+hourString+" hours and "+minutesString+" minutes."


	return timeToExpiration,nil



}


//Updates sensor data
func (s *SmartContract) UpdateSensorData(ctx contractapi.TransactionContextInterface, id string, newSensorData string) error {

	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return err
	}

	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	if clientID != asset.Owner {
		return fmt.Errorf("submitting client not authorized to update sensor data, does not own asset. Owner of asset is %v",asset.Owner)
	}

	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}
	if clientOrgID != asset.OwnerOrg {
		return fmt.Errorf("submitting client not authorized to update asset, not from the same Org")
	}

	asset.SensorData = newSensorData

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// DeleteAsset deletes asset from the world state.
func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {

	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return err
	}

	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	if clientID != asset.Owner {
		return fmt.Errorf("submitting client not authorized to delete asset, does not own asset. Owner of asset is %v",asset.Owner)
	}

	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}

	if clientOrgID != asset.OwnerOrg {
		return fmt.Errorf("submitting client not authorized to delete asset, not from the same Org")
	}

	return ctx.GetStub().DelState(id)
}

//Delete Buy Request
func (s *SmartContract) DeleteBuyRequest(ctx contractapi.TransactionContextInterface, id string, sharedCollection string) error {
	request, err := s.ReadRequestToBuy(ctx, id,sharedCollection)
	if err != nil {
		return err
	}

	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	if clientID != request.BuyerID {
		return fmt.Errorf("submitting client not authorized to delete buy request .Not his request. Client is %s and request was made by %s",clientID,request.BuyerID)
	}
	
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}

	if clientOrgID != request.BuyerMSP {
		return fmt.Errorf("submitting client not authorized to delete buy request, not from the same Org.Clients org is %s and buyers is %s",clientOrgID,request.BuyerMSP)
	}

	requestToBuyKey, err := ctx.GetStub().CreateCompositeKey(requestToBuyObjectType, []string{id})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	log.Printf("DeleteBuy Request : collection %v, ID %v,", sharedCollection, id)
	return ctx.GetStub().DelPrivateData(sharedCollection,requestToBuyKey)
}

//Deletes Bid request from buyers (after he becomes owner) implicit collection
func (s *SmartContract) DeleteBidRequest(ctx contractapi.TransactionContextInterface,assetID string ) error {


	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return fmt.Errorf("error reading asset: %v", err)
	}
	if asset == nil {
		return fmt.Errorf("%v does not exist", assetID)
	}
	// Verify that the client is submitting request to peer in their organization
	err = verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return fmt.Errorf("DeleteBidRequest cannot be performed: Error %v", err)
	}

	// Get collection name for this organization
	collectionBuyer, err := buildCollectionName(ctx)
	if err != nil {
		return fmt.Errorf("failed to infer private collection name for the org: %v", err)
	}

	// Delete the price records for seller
	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(agreedAssetPrice, []string{asset.ID})
	if err != nil {
		return fmt.Errorf("failed to create composite key for seller: %v", err)
	}

	//anyone can delete the data??? Probaby solved with access control
	err = ctx.GetStub().DelPrivateData(collectionBuyer, assetPriceKey)
	if err != nil {
		return fmt.Errorf("failed to delete bid request from implicit private data collection for seller: %v", err)
	}


	return nil

}


// AssetExists returns true when asset with given ID exists in world state
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}


/*=========================================HELPER FUNCTIONS==================================*/



// GetSubmittingClientIdentity returns the name and issuer of the identity that
// invokes the smart contract. This function base64 decodes the identity string
// before returning the value to the client or smart contract.
//files is located at pkg/cid/cid.go for GetID() on sourcegraph.com
//returns x509::CN=FarmerO,OU=org1+OU=client+OU=department1::CN=ca.org1.example.com,O=org1.example.com,L=Durham,ST=North Carolina,C=US
//on GetId() => ("x509::%s::%s", getDN(&c.cert.Subject), getDN(&c.cert.Issuer)
//DN is distinguished name as defined by RFC 2253
/* https://sourcegraph.com/github.com/hyperledger/fabric-chaincode-go@38d29fabecb9916a8a1ecbd0facb72f2ac32d016/-/blob/pkg/cid/cid.go?L76 */


func (s *SmartContract) GetSubmittingClientIdentity(ctx contractapi.TransactionContextInterface) (string, error) {

	b64ID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("Failed to read clientID: %v", err)
	}
	decodeID, err := base64.StdEncoding.DecodeString(b64ID)
	if err != nil {
		return "", fmt.Errorf("failed to base64 decode clientID: %v", err)
	}
	clientName:=_between(string(decodeID),"x509::CN=",",")
	return  clientName, nil
}


//GetSubmittingClientDN returns the Distinguished Name as defined by RFC 2253
func (s *SmartContract) GetSubmittingClientDN(ctx contractapi.TransactionContextInterface) (string, error) {

	b64ID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("Failed to read clientID: %v", err)
	}
	decodeID, err := base64.StdEncoding.DecodeString(b64ID)
	if err != nil {
		return "", fmt.Errorf("failed to base64 decode clientID: %v", err)
	}
	
	return string(decodeID) , nil
}

//Function to get string between two strings.
func _between(value string, a string, b string) string {
    // Get substring between two strings.
    posFirst := strings.Index(value, a)
    if posFirst == -1 {
        return ""
    }
    posLast := strings.Index(value, b)
    if posLast == -1 {
        return ""
    }
    posFirstAdjusted := posFirst + len(a)
    if posFirstAdjusted >= posLast {
        return ""
    }
    return value[posFirstAdjusted:posLast]
}
