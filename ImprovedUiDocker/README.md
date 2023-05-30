# Web UI for HLF App

docker run -p 4000:4000 -v /app/node_modules -v "/home/dejvi/Documents/gitDownloads/fabric-samples/ImprovedUiDocker/WebUI/backend:/app" --name server --network fabric_test servertry:new

docker cp ./organizations/peerOrganizations/org1.example.com/connection-peer0org1.json server:/app/app

docker run -p 3000:3000 -v /app/node_modules -v "/home/dejvi/Documents/gitDownloads/fabric-samples/ImprovedUiDocker/WebUI/frontend:/app" --name frontend --network fabric_test  frontend:try 
