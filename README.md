# Supply chain Traceability application network on Hyperledger Fabric v2.3.2

In this supply chain network there will be 3 participating organizations:
  * Farmers (Org1) (2 nodes)
  * Retailers (Org2) (2 nodes)
  * Supermarket-Consumers (Org3) (1 node)

(Insert Network Architecture Image)

  To avoid conflicts we create 2 private collections between transacting parties (Org1-Org2, Org2-Org3).
Any transactions details (prices etc) should remain private and only transacting organizations should have access. 

## Commands to run network. 
1. Bring up the network, create credentials and certificates using Fabric CAs and create the network channel.
``` 
./network.sh up createChannel -ca
```
(End result image)

2. Deploy smart contract with private collection configuration
```
./network.sh deployCC -ccn try -ccp ../@5Scenario/ -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" -cccg ../@5Scenario/collections_config.json

```
(result image)

3. Deploy Front-end and Backend
Go on ImprovedUi/WebUi/backend folder.
```
cd ../ImprovedUi/WebUi/
```
On separate terminals run while on backend folder:
To run backend:
```
cd backend/
npm run server
```
To run front-end:
```
npm run client
```
Alternatively use ./start.sh script to automatically start the whole application. 
NOTE: My terminal is Tilix so you should modify the script commands on ImprovedUi/WebUi/backend/package.json.
On the dev command in the package.json change Tilix to your local terminal. 
```
  "scripts": {
    "server": "nodemon index.js",
    "client": "npm run start --prefix ../frontend",
    "dev": "concurrently --kill-others-on-fail \"npm run server\" \"tilix -a session-add-down -x npm run client\""
  }
 ```


