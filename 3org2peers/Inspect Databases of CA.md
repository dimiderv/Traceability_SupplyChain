To run tutorial on https://kctheservant.medium.com/exploring-fabric-ca-registration-and-enrollment-1b9f4a1b3ace

For docker exec -it ca_peerOrg1 bash you have to run docker exec -it ca_org1 sh
and inside since its  alpine you have to run  apk add --upgrade sqlite
and then follow instructions

#step 1
docker exec -it ca_org1 sh

apk add --upgrade sqlite

#Step 2
cd /etc/hyperledger/fabric-ca-server
sqlite3 fabric-ca-server.db

#Step 3
.tables

select * from users;
select * from certificates;
