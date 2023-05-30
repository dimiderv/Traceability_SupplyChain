#Adding an Org3 to our existing Network
Note first test network should be created and after step 3 deployCC should be called
#Step 1:
Bring up the test network using ./network.sh up createChannel -ca -s couchdb

#Step 2: 
Go to addOrg3 folder 
Run command *./addOrg3.sh generate -ca*  to generate crypto

#Step 3:
Run command *./addOrg3.sh up -ca -s chouchdb* ( might run without -ca not sure yet)
To add org3 to network


#Step 4:
Enviroment Variable to be able to install chaincode as org3, assuming that a chaincode has been deployed by other orgs

		export PATH=${PWD}/../bin:$PATH
		export FABRIC_CFG_PATH=$PWD/../config/
		export CORE_PEER_TLS_ENABLED=true
		export CORE_PEER_LOCALMSPID="Org3MSP"
		export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
		export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
		export CORE_PEER_ADDRESS=localhost:11051

#Step 5:
Package chaincode 

			peer lifecycle chaincode package try.tar.gz --path ../phase2/ --lang golang --label try_1.0

Install

			peer lifecycle chaincode install try.tar.gz
		
Get packageID 
	
			peer lifecycle chaincode queryinstalled

Create enviroment variable for package
	
			export CC_PACKAGE_ID=try_1.0:c458900a13a84e71c3ec1391fa61fd4c1e5eef560c5ef3ad49f580582a88bb87

Approve for Org3 ( --signature-policy and --collections-config are optional and depend on the chaincode)

		peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel  --name try --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --signature-policy 'OR('\''Org1MSP.peer'\'','\''Org2MSP.peer'\'','\''Org3MSP.peer'\'')' --collections-config ../asset-transfer-private-data/chaincode-go/collections_config.json
		 
If query was commited
		peer lifecycle chaincode querycommitted --channelID mychannel --name try --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
		
Check if chaincode can be invoked by org3

		peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n try --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
		
This command is going to be needed if we create a new affiliation that doesn't exist on the fabric-ca-server-confif file
		
fabric-ca-client affiliation add manufacturer.department1

