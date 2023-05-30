package chaincode

import (
  "encoding/json"
  "fmt"
  "log"
  "bytes"
  "github.com/hyperledger/fabric-contract-api-go/contractapi"
  "time"
  "crypto/sha256"
  "github.com/golang/protobuf/ptypes"

  "github.com/hyperledger/fabric-chaincode-go/shim"
  
)

/*--------Phase 3 code-------------*/
const (
	assetForSale     = "AssetForSale" //goes into sellers collection
	agreedAssetPrice = "AgreedAssetPrice" //goes into buyers collection as he agrees price

)
const assetCollection = "assetCollection"
const assetCollection23 = "assetCollection23"
const requestToBuyObjectType = "BuyRequest"

type RequestToBuyObject struct {
	ID        string 	`json:"assetID"`
	BuyerID   string 	`json:"buyerID"`
	BuyerMSP  string    `json:"buyerMSP"`
	Timestamp time.Time `json:"timestamp"`
	TxId      string    `json:"txId"`
	Salt 	  string 	`json:"salt"`	
}
	
	
	
type assetPriceTransientInput struct {
	ID        string 	`json:"asset_id"`
	Price 	  int 		`json:"price"`
	TradeID   int 		`json:"trade_id"`
	Salt 	  string 	`json:"salt"`
}




//Puts Price to Org1 implicit collection
func (s *SmartContract) SetPrice(ctx contractapi.TransactionContextInterface, assetID string) error {
	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return err
	}

	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	// Verify that this client  actually owns the asset.
	if clientID != asset.Owner {
		return fmt.Errorf("a client  %s cannot sell an asset owned by %s", clientID, asset.Owner)
	}
	
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}

	if clientOrgID != asset.OwnerOrg {
		return fmt.Errorf("submitting client not from the same Org.Clients org is %s and buyers is %s", clientOrgID, asset.OwnerOrg)
	}


	return SaveToSellerCollection(ctx, assetID, assetForSale)
}



// SaveToCollection adds a bid or ask price,as a composite key to caller's implicit private data collection and to shared collection
func SaveToSellerCollection(ctx contractapi.TransactionContextInterface, assetID string, priceType string) error {
	// In this scenario, client is only authorized to read/write private data from its own peer.
	err := verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return fmt.Errorf("Could not be verified. : Error %v", err)
	}

	transMap, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("error getting transient: %v", err)
	}

	// Asset price must be retrieved from the transient field as they are private
	price, ok := transMap["asset_price"]
	if !ok {
		return fmt.Errorf("asset_price key not found in the transient map")
	}

	collection ,err:= buildCollectionName(ctx)
	if err != nil {
		return fmt.Errorf("failed to infer private collection name for the org: %v", err)
	}
	// Persist the agreed to price in a collection sub-namespace based on priceType key prefix,
	// to avoid collisions between private asset properties, sell price, and buy price
	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(priceType, []string{assetID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	// The Price hash will be verified later, therefore always pass and persist price bytes as is,
	// so that there is no risk of nondeterministic marshaling.
	err = ctx.GetStub().PutPrivateData(collection, assetPriceKey, price)
	if err != nil {
		return fmt.Errorf("failed to put asset bid: %v", err)
	}


	
	// var assetPriceInput assetPriceTransientInput
	// //unmarshal price data so they can be read from buyer on shared collection
	// err = json.Unmarshal(price, &assetPriceInput)
	// if err != nil {
	// 	return fmt.Errorf("failed to unmarshal JSON: %v", err)
	// }
	clientMSPID,err:=ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the client's MSPID: %v", err)
	}

	//puts price data on shared collection , might need unmarshal later to read price
	tempCollection:=assetCollection
	if clientMSPID =="Org2MSP"{
		tempCollection=assetCollection23
	}
	err = ctx.GetStub().PutPrivateData(tempCollection, assetPriceKey, price)
	if err != nil {
		return fmt.Errorf("failed to put asset bid: %v", err)
	}

	return nil
}



// AgreeToBuy adds buyer's bid price to buyer's implicit private data collection
func (s *SmartContract) AgreeToBuy(ctx contractapi.TransactionContextInterface, assetID string) error {

	clientMSPID,err:=ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the client's MSPID: %v", err)
	}

	collection:=assetCollection
	if clientMSPID =="Org3MSP"{
		collection=assetCollection23
	}

	//this might not work cause s is not defined,price needs to be marshalled
	price,err:= s.ReadAssetPrice(ctx,assetID,collection)
	if err != nil {
		return fmt.Errorf("failed to ReadAssetPrice : %v", err)
	}
	return SaveToBuyerCollection(ctx, assetID, agreedAssetPrice,price)
}

// SaveToBuyerCollection adds a bid to callers implicit data after it reads from shared collection it's price
func SaveToBuyerCollection(ctx contractapi.TransactionContextInterface, assetID string, priceType string,price *assetPriceTransientInput) error {
	// In this scenario, client is only authorized to read/write private data from its own peer.
	err := verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return fmt.Errorf("Could not be verified. : Error %v", err)
	}



	//make price as bytes
	priceAsBytes, err := json.Marshal(price)
	if err != nil {
		return fmt.Errorf("failed marshalling asset %v: %v", assetID, err)
	}

	collection ,err:= buildCollectionName(ctx)
	if err != nil {
		return fmt.Errorf("failed to infer private collection name for the org: %v", err)
	}
	// Persist the agreed to price in a collection sub-namespace based on priceType key prefix,
	// to avoid collisions between private asset properties, sell price, and buy price
	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(priceType, []string{assetID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	// The Price hash will be verified later, therefore always pass and persist price bytes as is,
	// so that there is no risk of nondeterministic marshaling.
	err = ctx.GetStub().PutPrivateData(collection, assetPriceKey, priceAsBytes)
	if err != nil {
		return fmt.Errorf("failed to put asset bid: %v", err)
	}

	return nil
}

//Puts Buy request on shared Private Collection
func (s *SmartContract) RequestToBuy(ctx contractapi.TransactionContextInterface,assetID string ) error {

	// Get ID of submitting client identity
	buyerID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	clientMSPID,err:=ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the client's MSPID: %v", err)
	}
	collection:=assetCollection
	if clientMSPID =="Org3MSP"{
		collection=assetCollection23
	}


	//check if a request already exists,so users cant override requests
	exists, err := s.RequestToBuyExists(ctx, assetID,collection)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("A request for the asset %s already exists", assetID)
	}
	//timestamp to add security
	timeS,err:= ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return  err
	}
	timestamp, err := ptypes.Timestamp(timeS)
	if err != nil {
		return err
	}
	// //transaction ID
	txId:= ctx.GetStub().GetTxID()
	// if err == nil {
	// 	return  err
	// }
	
	//here request object is created
	var requestTemp RequestToBuyObject
	requestTemp.ID=assetID
	requestTemp.BuyerID=buyerID
	requestTemp.BuyerMSP=clientMSPID
	requestTemp.Timestamp=timestamp
	requestTemp.TxId=txId

	hash := sha256.New()
	hash.Write([]byte(assetID)) //has of request details
	temp := hash.Sum(nil)
	salt := fmt.Sprintf("%x", temp)
	
	requestTemp.Salt=salt
	

	// Create agreeement that indicates which identity has agreed to purchase
	// In a more realistic transfer scenario, a transfer agreement would be secured to ensure that it cannot
	// be overwritten by another channel member
	buyRequestKey, err := ctx.GetStub().CreateCompositeKey(requestToBuyObjectType, []string{assetID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}
	requestAsBytes, err := json.Marshal(requestTemp)
	if err != nil {
		return fmt.Errorf("failed marshalling asset %v: %v", assetID, err)
	}
	//puts request to buy on shared co
	err = ctx.GetStub().PutPrivateData(collection,buyRequestKey,requestAsBytes)
	if err != nil {
		return fmt.Errorf("failed to put asset bid: %v", err)
	}
	log.Printf("Request To Buy : collection %v, ID %v, from %v", collection, assetID,clientMSPID)


	return nil
}

//Transfers asset , deletes price keys from sellers & buyers collections, deletes buyRequest from shared collection and creates Receipts for both orgs
func (s *SmartContract) TransferRequestedAsset(ctx contractapi.TransactionContextInterface,assetID string) error {

	//we have to choose the correct collection
	clientMSPID,err:=ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the client's MSPID: %v", err)
	}
	//this might need to be changed so Org3 can sell to its clients or create another function
	collection:=assetCollection
	if clientMSPID =="Org2MSP"{
		collection=assetCollection23
	}
	//read buy request that has assetID,BuyerID and BuyerMSP
	buyRequest, err := s.ReadRequestToBuy(ctx, assetID,collection)
	if err != nil {
		return fmt.Errorf("failed ReadRequestToBuy to find buyerID: %v", err)
	}
	if buyRequest.BuyerID == "" {
		return fmt.Errorf("BuyerID not found in buyRequest for %v", assetID)
	}
	if buyRequest.BuyerMSP == "" {
		return fmt.Errorf("BuyerMSP not found in buyRequest for %v", assetID)
	}
	if buyRequest.ID == "" {
		return fmt.Errorf("assetID not found in buyRequest for %v", assetID)
	}

	log.Printf("TransferAsset: verify asset exists ID %v",assetID)
	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return fmt.Errorf("error reading asset: %v", err)
	}
	if asset == nil {
		return fmt.Errorf("%v does not exist",assetID)
	}
	// Verify that the client is submitting request to peer in their organization
	err = verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return fmt.Errorf("TransferAsset cannot be performed: Error %v", err)
	}

	// Verify transfer details and transfer owner
	err = s.verifyAgreement(ctx, assetID, asset.Owner,asset.OwnerOrg, buyRequest.BuyerMSP)
	if err != nil {
		return fmt.Errorf("failed transfer verification: %v", err)
	}

	//change ownership
	asset.Owner = buyRequest.BuyerID
	asset.OwnerOrg = buyRequest.BuyerMSP

	assetJSONasBytes, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("failed marshalling asset %v: %v", asset.ID, err)
	}

	//Update Asset with new owner
	err = ctx.GetStub().PutState( asset.ID, assetJSONasBytes) 
	if err != nil {
		return err
	}

	// Get collection name for this organization
	collectionSeller, err := buildCollectionName(ctx)
	if err != nil {
		return fmt.Errorf("failed to infer private collection name for the org: %v", err)
	}


	//get assetPrice key
	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(assetForSale, []string{asset.ID})
	if err != nil {
		return fmt.Errorf("failed to create composite key for seller: %v", err)
	}
	// Delete the price records for seller
	//anyone can delete the data??? Probaby solved with access control
	err = ctx.GetStub().DelPrivateData(collectionSeller, assetPriceKey)
	if err != nil {
		return fmt.Errorf("failed to delete asset price from implicit private data collection for seller: %v", err)
	}
	//delete the price from the shared collection, no longer needed but could keep it still
	err = ctx.GetStub().DelPrivateData(collection, assetPriceKey)
	if err != nil {
		return fmt.Errorf("failed to delete asset price from implicit private data collection for seller: %v", err)
	}

	return nil

}



/*============================HELPER FUNCTIONS=============================================*/

// verifyAgreement is an internal helper function used by TransferAsset to verify
// that the transfer is being initiated by the owner and that the buyer has agreed
// to the same appraisal value as the owner
func (s *SmartContract) verifyAgreement(ctx contractapi.TransactionContextInterface, assetID string, owner string,ownerOrg string, buyerMSP string) error {

	// Check 1: verify that the transfer is being initiatied by the owner

	// Get ID of submitting client identity
	clientID, err := s.GetSubmittingClientIdentity(ctx)
	if err != nil {
		return err
	}

	if clientID != owner {
		return fmt.Errorf("error: submitting client identity does not own asset")
	}

	//added this to avoid same name but different orgs
	clientOrgID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return  fmt.Errorf("failed getting client's orgID: %v", err)
	}

	if clientOrgID != ownerOrg {
		return fmt.Errorf("submitting client not from the same Org.Clients org is %s and buyers is %s",clientOrgID,ownerOrg)
	}


	// Check 2: verify that the buyer has agreed to the appraised value

	// Get collection names
	collectionSeller, err := buildCollectionName(ctx) // get owner collection from caller identity
	if err != nil {
		return fmt.Errorf("failed to infer private collection name for the org: %v", err)
	}

	collectionBuyer :="_implicit_org_"+ buyerMSP  // get buyers collection

	// Get sellers asking price
	assetForSaleKey, err := ctx.GetStub().CreateCompositeKey(assetForSale, []string{assetID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}
	sellerPriceHash, err := ctx.GetStub().GetPrivateDataHash(collectionSeller, assetForSaleKey)
	if err != nil {
		return fmt.Errorf("failed to get seller price hash: %v", err)
	}
	if sellerPriceHash == nil {
		return fmt.Errorf("seller price for %s does not exist", assetID)
	}

	// Get buyers bid price
	
	assetBidKey, err := ctx.GetStub().CreateCompositeKey(agreedAssetPrice, []string{assetID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}
	buyerPriceHash, err := ctx.GetStub().GetPrivateDataHash(collectionBuyer, assetBidKey)
	if err != nil {
		return fmt.Errorf("failed to get buyer price hash: %v", err)
	}
	if buyerPriceHash == nil {
		return fmt.Errorf("buyer price for %s does not exist", assetID)
	}

	// Verify that the two hashes match
	if !bytes.Equal(sellerPriceHash,buyerPriceHash ) {
		return fmt.Errorf("hash for appraised value for owner %x does not match value for seller %x", sellerPriceHash, buyerPriceHash)
	}

	return nil
}



// verifyClientOrgMatchesPeerOrg is an internal function used verify client org id and matches peer org id.
func verifyClientOrgMatchesPeerOrg(ctx contractapi.TransactionContextInterface) error {
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the client's MSPID: %v", err)
	}
	peerMSPID, err := shim.GetMSPID()
	if err != nil {
		return fmt.Errorf("failed getting the peer's MSPID: %v", err)
	}

	if clientMSPID != peerMSPID {
		return fmt.Errorf("client from org %v is not authorized to read or write private data from an org %v peer", clientMSPID, peerMSPID)
	}

	return nil
}

func buildCollectionName(ctx contractapi.TransactionContextInterface) (string, error) {
	// Get the MSP ID of submitting client identity
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return "", fmt.Errorf("failed to get verified MSPID: %v", err)
	}
	return fmt.Sprintf("_implicit_org_%s", clientMSPID),err
}