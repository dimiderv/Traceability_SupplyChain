package chaincode

import (
	"encoding/json"
	"fmt"
	"log"
	"github.com/golang/protobuf/ptypes"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// HistoryQueryResult structure used for returning result of history query
//got it from asset-transfer-ledger-queries
type HistoryQueryResult struct {
	Record    *Asset    `json:"record"`
	TxId     string    `json:"txId"`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
}

//Get asset data with expiration string struct
type AssetExp struct {
	AssetObj       Asset `json:"asset_obj"`
	ExpirationTime string `json:"expirationTime"`
}
// ReadAsset returns the asset stored in the world state with given id.
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {

	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// GetAssetHistory returns the chain of custody for an asset since issuance.
//got it from asset-transfer-ledger-queries
func (s *SmartContract) GetAssetHistory(ctx contractapi.TransactionContextInterface, assetID string) ([]HistoryQueryResult, error) {
	log.Printf("GetAssetHistory: ID %v", assetID)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(assetID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &asset)
			if err != nil {
				return nil, err
			}
		} else {
			asset = Asset{
				ID: assetID,
			}
		}


		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &asset,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}



// ReadAsset returns the asset stored in the world state with given id.
func (s *SmartContract) ReadAssetWithExpiration(ctx contractapi.TransactionContextInterface, id string) (*AssetExp, error) {

	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var asset Asset
	var temp AssetExp
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}
	temp.AssetObj=asset
	expiration,err:= s.ExpiresIn(ctx,id)
	if err != nil {
		return nil,fmt.Errorf("failed to ReadAssetPrice : %v", err)
	}
	temp.ExpirationTime=expiration

	return &temp, nil
}



// GetAllAssets returns all assets found in world state
func (s *SmartContract) GetAllAssetsExpiration(ctx contractapi.TransactionContextInterface) ([]*AssetExp, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()
	var final []*AssetExp 
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		var temp AssetExp
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, err
		}
		temp.AssetObj=asset
		expiration,err:= s.ExpiresIn(ctx,(&asset).ID)
		if err != nil {
			return nil,fmt.Errorf("failed to run Expires in : %v", err)
		}
		temp.ExpirationTime=expiration

		final = append(final, &temp)
		
	}

	return final, nil
}