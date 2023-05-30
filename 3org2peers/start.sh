./network.sh up createChannel -ca

./network.sh deployCC -ccn try -ccp ../@5Scenario/ -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" -cccg ../@5Scenario/collections_config.json

# cd ../ImprovedUi/WebUI/backend/ 

# cd routes/

# rm -r wallet/

# cd ..

# npm run dev







