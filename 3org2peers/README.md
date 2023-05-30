# This Tutorial demostates how to add a new peer to an existing org

## link: https://kctheservant.medium.com/add-a-peer-to-an-organization-in-test-network-hyperledger-fabric-v2-2-4a08cb901c98

### Step 1 
```bash
./network.sh up createChannel -ca
```
### Step 2: Deploy chaincode SACC
```bash
        ./network.sh deployCC -ccn mycc -ccp ../chaincode/sacc -ccl go
```
### Step 3: Test chaincode
```bash
        peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile $ORDERER_CA -C mychannel -n mycc --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["set","name","Alice"]}'
````
```bash
        peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'
```
### Step 4: Generate crypto material for new peer

```bash
      export PATH=$PATH:${PWD}/../bin
export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.example.com/
fabric-ca-client register --caname ca-org1 --id.name peer1 --id.secret peer1pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
mkdir -p organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com
fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp --csr.hosts peer1.org1.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/org1.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/config.yaml
fabric-ca-client enroll -u https://peer1:peer1pw@localhost:7054 --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls --enrollment.profile tls --csr.hosts peer1.org1.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.crt
cp ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.key
### Step 5: Create configuration for the new peer and bring up the container ( Only Once )

The following code is the on that works. Configuration on article is inacurate
```
Copyright IBM Corp. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
	version: '2'

	volumes:
	  peer1.org1.example.com:

	networks:
	  test:

	services:

	  peer1.org1.example.com:
	    container_name: peer1.org1.example.com
	    image: hyperledger/fabric-peer:latest
	    environment:
	      #Generic peer variables
	      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
	      # the following setting starts chaincode containers on the same
	      # bridge network as the peers
	      # https://docs.docker.com/compose/networking/
	      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_test
	      - FABRIC_LOGGING_SPEC=INFO
	      #- FABRIC_LOGGING_SPEC=DEBUG
	      - CORE_PEER_TLS_ENABLED=true
	      - CORE_PEER_PROFILE_ENABLED=true
	      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
	      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
	      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
	      # Peer specific variabes
	      - CORE_PEER_ID=peer1.org1.example.com
	      - CORE_PEER_ADDRESS=peer1.org1.example.com:8051
	      - CORE_PEER_LISTENADDRESS=0.0.0.0:8051
	      - CORE_PEER_CHAINCODEADDRESS=peer1.org1.example.com:8052
	      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:8052
	      - CORE_PEER_GOSSIP_BOOTSTRAP=peer1.org1.example.com:8051
	      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.org1.example.com:8051
	      - CORE_PEER_LOCALMSPID=Org1MSP
	    volumes:
		- /var/run/:/host/var/run/
		- ../organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp:/etc/hyperledger/fabric/msp
		- ../organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls:/etc/hyperledger/fabric/tls
		- peer1.org1.example.com:/var/hyperledger/production
	    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
	    command: peer node start
	    ports:
	      - 8051:8051
	    networks:
	      - test
```
#command
```bash
        docker-compose -f docker/docker-compose-peer1org1.yaml up -d
```
### Step 6 Join peer to existing channel
```bash
          peer channel list CORE_PEER_ADDRESS=localhost:8051 peer channel list

          CORE_PEER_ADDRESS=localhost:8051 peer channel join -b channel-artifacts/mychannel.block
  
          peer channel getinfo -c mychannel

          CORE_PEER_ADDRESS=localhost:8051 peer channel getinfo -c mychannel
```
### Step 7: Install chaincode to that peer
```bash
            peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}' CORE_PEER_ADDRESS=localhost:8051 peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'

            CORE_PEER_ADDRESS=localhost:8051 peer lifecycle chaincode install mycc.tar.gz

            docker ps --filter="name=dev"

            docker images dev*
```
### Step 8 Test chaincode using new peer
```bash
              peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}' CORE_PEER_ADDRESS=localhost:8051 peer chaincode query -C mychannel -n mycc -c '{"Args":["get","name"]}'

              peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls true --cafile $ORDERER_CA -C mychannel -n mycc --peerAddresses localhost:8051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["set","name","Bob"]}'
```
## !!!!!!!!!SHOULD BE DONE WHEN NETWORK IS BROUGHT DOWN !!!!!!!!\
```
docker volume prune
```
