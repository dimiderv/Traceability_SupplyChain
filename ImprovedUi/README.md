# Web UI for HLF App

This is currently going to be implemented for 3Orgs_Network which has 3 organizations with a peer each. The chaincode deployment is going to be from scenario 3 were org shared collection between them to keep their data private and price is not sent but is put in the shared collecton between them 


## Command to deploy chaincode

		./network.sh deployCC -ccn try -ccp ../@3rdScenario/ -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" -cccg ../@3rdScenario/collections_config.json


Im going to include code from the sharedCollection.js on the app folder.

Front End and backend is located on folder WebUI.

In the app folder there are 2 working apps. 
 1. appOrg3.js where orgs use a shared collection to put buy requests
 2. sharedCollection.js where orgs use shared collections between them
