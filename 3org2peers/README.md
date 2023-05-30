# Traceability application network

In this supply chain network there will be 3 participating organizations:
  * Farmers (Org1) (2 nodes)
  * Retailers (Org2) (2 nodes)
  * Supermarket-Consumers(Org3) (1 node)

(Insert Network Architecture Image)

  To avoid conflicts we create 2 private collections between transacting parties (Org1-Org2, Org2-Org3).
Any transactions details (prices etc) should remain private and only transacting organizations should have access. 

## Commands to run network. 
1. Bring up the network, create credentials and certificates using Fabric CAs and create the network channel.
``` 
./network.sh up createChannel -ca
```

2. 


