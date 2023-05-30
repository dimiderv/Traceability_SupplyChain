package chaincode

import (
	"encoding/json"
	"fmt"
	"log"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	//"time"
)



// RequestToBuyExists returns true when asset Price exists on shared collection so we dont redefine it
func (s *SmartContract) RequestToBuyExists(ctx contractapi.TransactionContextInterface, assetID string,sharedCollection string) (bool, error) {

	requestToBuyKey, err := ctx.GetStub().CreateCompositeKey(requestToBuyObjectType, []string{assetID})
	if err != nil {
		return false, fmt.Errorf("failed to create composite key: %v", err)
	}
	requestJSON, err := ctx.GetStub().GetPrivateData(sharedCollection, requestToBuyKey) // Get price from shared collection
	if err != nil {
		return false, fmt.Errorf("failed to read RequestToBuyObject: %v", err)
	}

	return requestJSON != nil, nil
}


// ReadRequestToBuy gets the buyer's identity and buyers MSP from the transfer request from collection
func (s *SmartContract) ReadRequestToBuy(ctx contractapi.TransactionContextInterface, assetID string, sharedCollection string) (*RequestToBuyObject, error) {
	// composite key for RequestToBuyObject of this asset
	transferAgreeKey, err := ctx.GetStub().CreateCompositeKey(requestToBuyObjectType, []string{assetID})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key: %v", err)
	}

	log.Printf("ReadRequestToBuy: collection %v, ID %v", sharedCollection, assetID)
	requestJSON, err := ctx.GetStub().GetPrivateData(sharedCollection, transferAgreeKey) // Get the state from world state
	if err != nil {
		return nil, fmt.Errorf("failed to read RequestToBuyObject: %v", err)
	}
	if requestJSON == nil {
		log.Printf("RequestToBuyObject for %v does not exist", assetID)
		return nil, nil
	}

	var assetBuyRequestObj RequestToBuyObject
	err = json.Unmarshal(requestJSON, &assetBuyRequestObj)
	if err != nil {
		return nil, err
	}

	request := &RequestToBuyObject{
		ID:      assetBuyRequestObj.ID,
		BuyerID: 	 assetBuyRequestObj.BuyerID,
		BuyerMSP:  assetBuyRequestObj.BuyerMSP,
		Timestamp: assetBuyRequestObj.Timestamp,
		TxId: assetBuyRequestObj.TxId,
		Salt: assetBuyRequestObj.Salt}
		
	return request, nil
}


// AssetPriceExists returns true when asset Price exists on shared collection so we dont redefine it
func (s *SmartContract) AssetPriceExists(ctx contractapi.TransactionContextInterface, assetID string,sharedCollection string) (bool, error) {

	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(assetForSale, []string{assetID})
	if err != nil {
		return false, fmt.Errorf("failed to create composite key: %v", err)
	}
	priceJSON, err := ctx.GetStub().GetPrivateData(sharedCollection, assetPriceKey) // Get price from shared collection
	if err != nil {
		return false, fmt.Errorf("failed to read RequestToBuyObject: %v", err)
	}



	return priceJSON != nil, nil
}

// ReadAssetPrice get the price that the seller put on shared collection.Should return an unmarshalled object with properties of asset_id,price,trade_id in GO ID,Price,TradeID
func (s *SmartContract) ReadAssetPrice(ctx contractapi.TransactionContextInterface, assetID string,sharedCollection string) (*assetPriceTransientInput, error) {
	//create the price key of asset
	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(assetForSale, []string{assetID})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key: %v", err)
	}
	log.Printf("Read price from : Collection %v, ID %v", sharedCollection, assetID)
	priceJSON, err := ctx.GetStub().GetPrivateData(sharedCollection, assetPriceKey) // Get price from shared collection
	if err != nil {
		return nil, fmt.Errorf("failed to read RequestToBuyObject: %v", err)
	}

	if priceJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", assetID)
	}
	type assetPriceTemp struct {
		ID        string 	`json:"asset_id"`
		Price 	  int 		`json:"price"`
		TradeID   int 		`json:"trade_id"`
		Salt 	  string 	`json:"salt"`
	}
	var assetPriceInput assetPriceTemp
	err = json.Unmarshal(priceJSON, &assetPriceInput)
	if err != nil {
		return nil, err
	}
	request := &assetPriceTransientInput{
		ID:      	assetPriceInput.ID,
		Price: 	 	assetPriceInput.Price,
		TradeID: 	assetPriceInput.TradeID,
		Salt: 	 	assetPriceInput.Salt}
	return request, nil
}


/*==========help functions from asset-transfer-secured-agreement==========*/

func (s *SmartContract) GetAssetSalesPrice(ctx contractapi.TransactionContextInterface, assetID string) (string, error) {
	return getAssetPrice(ctx, assetID, assetForSale)
}

// GetAssetBidPrice returns the bid price
func (s *SmartContract) GetAssetBidPrice(ctx contractapi.TransactionContextInterface, assetID string) (string, error) {
	return getAssetPrice(ctx, assetID, agreedAssetPrice)
}

// getAssetPrice gets the bid or ask price from caller's implicit private data collection
func getAssetPrice(ctx contractapi.TransactionContextInterface, assetID string, priceType string) (string, error) {
	err := verifyClientOrgMatchesPeerOrg(ctx)
	if err != nil {
		return "",fmt.Errorf("TransferAsset cannot be performed: Error %v", err)
	}

	collection, err := buildCollectionName(ctx)
	if err != nil {
		return "", err
	}

	assetPriceKey, err := ctx.GetStub().CreateCompositeKey(priceType, []string{assetID})
	if err != nil {
		return "", fmt.Errorf("failed to create composite key: %v", err)
	}

	price, err := ctx.GetStub().GetPrivateData(collection, assetPriceKey)
	if err != nil {
		return "", fmt.Errorf("failed to read asset price from implicit private data collection: %v", err)
	}
	if price == nil {
		return "", fmt.Errorf("asset price does not exist: %s", assetID)
	}

	return string(price), nil
}

