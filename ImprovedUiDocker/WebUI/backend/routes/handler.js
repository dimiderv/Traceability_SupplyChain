const express = require('express');
const router = express.Router();


// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin,registerAndEnrollFarmer, registerAndEnrollRetailer } = require('../app/CAUtil')
const { buildCCPOrg1, buildWallet, buildCCPOrg2,buildCCPOrg3 } = require('../app/AppUtil');
const { rootCertificates } = require('tls');
const { response } = require('express');

//Chaincode and Users parameters
const channelName = 'mychannel';
const chaincodeName = 'try';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const mspOrg3 = 'Org3MSP';

let org1UserId = 'George Karl';
let org2UserId = 'Jim McGinn'; //Mason Bridges
let org3UserId = 'Jack Porter';
const assetCollection = 'assetCollection';
const sharedCollectionOrg2Org3 = 'assetCollection23';
//org1UserId+="b";
//org2UserId+="b";
//org3UserId+="b";

/* Helper Function to connect users to network */

async function initContractFromOrg1Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org1 identity to Org1 Peer');
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccpOrg1 = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');

    // setup the wallet to cache the credentials of the application user, on the app server locally
    const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
    const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

    // in a real application this would be done on an administrative flow, and only once
    // stores admin identity in local wallet, if needed
    await enrollAdmin(caOrg1Client, walletOrg1, mspOrg1);
    // register & enroll application user with CA, which is used as client identify to make chaincode calls
    // and stores app user identity in local wallet
    // In a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    await registerAndEnrollFarmer(caOrg1Client, walletOrg1, mspOrg1, org1UserId, 'org1.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg1 = new Gateway();
        //connect using Discovery enabled
        await gatewayOrg1.connect(ccpOrg1,
            { wallet: walletOrg1, identity: org1UserId, discovery: { enabled: true, asLocalhost: false } });

        return gatewayOrg1;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

async function initContractFromOrg2Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org2 identity to Org2 Peer');
    const ccpOrg2 = buildCCPOrg2();
    const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');

    const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
    const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

    await enrollAdmin(caOrg2Client, walletOrg2, mspOrg2);
    await registerAndEnrollRetailer(caOrg2Client, walletOrg2, mspOrg2, org2UserId, 'org2.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg2 = new Gateway();
        await gatewayOrg2.connect(ccpOrg2,
            { wallet: walletOrg2, identity: org2UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg2;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

async function initContractFromOrg3Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org3 identity to Org3 Peer');
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccpOrg3 = buildCCPOrg3();

 
    const caOrg3Client = buildCAClient(FabricCAServices, ccpOrg3, 'ca.org3.example.com');

    const walletPathOrg3 = path.join(__dirname, 'wallet/org3');
    const walletOrg3 = await buildWallet(Wallets, walletPathOrg3);


    await enrollAdmin(caOrg3Client, walletOrg3, mspOrg3);

    await registerAndEnrollUser(caOrg3Client, walletOrg3, mspOrg3, org3UserId, 'org3.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg3 = new Gateway();
        //connect using Discovery enabled
        await gatewayOrg3.connect(ccpOrg3,
            { wallet: walletOrg3, identity: org3UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg3;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}



let statefulTxn;
let tmapData;
let result;
let assetID = "asset100"//req.body.id;
let weight = 100//req.body.weight;
let color = "red"//req.body.color;
let newColor="i changed the color";
let newWeight= 99999;
let randomNumber=1;
let globalTradeID=1;
let globalAssetID=6;
let initWasCalled=false;

/* Get and post methods for the app */

/**Create Asset and Init Ledger can  be used only from farmer side */

router.get('/initLedger', async (req, res) => {


//Make this show the assets as they should not in a column but as a flex wrap
    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });

        if(!initWasCalled){
            statefulTxn = contractOrg1.createTransaction('InitLedger');
            initWasCalled=true;
            statefulTxn.setEndorsingOrganizations(mspOrg1);
            result = await statefulTxn.submit();
        }
        
        
        console.log(" World State was populated successfully !");
        result = await contractOrg1.evaluateTransaction('GetAllAssetsExpiration')//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);

        //res.end();
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }

});


router.post('/createAssetData', async (req, res) => {


    try {
        // req.body.assetID;
        globalAssetID+=1;
        console.log("global Asset ID without error is ",globalAssetID);
        const newAsset= "asset"+ globalAssetID.toString();
        const newWeight=parseInt(req.body.weight);
        const assetType=req.body.assetType;
        console.log(newAsset,newWeight);
        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        statefulTxn = contractOrg1.createTransaction('CreateAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg1);
        result = await statefulTxn.submit(newAsset,newWeight,assetType);
        console.log(" Asset Was created. Public details should be present !");
        result = await contractOrg1.evaluateTransaction('ReadAssetWithExpiration',newAsset)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
        

        //res.end();
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
       //globalAssetID-=1;
       console.log("global Asset ID is with error ",globalAssetID);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status

                })));
        //process.exit(1);
    }
    

});


/**Update sensor data  */
router.post('/postUpdateSensorData', async function  (req,res) {
    console.log("post Update of sensor data");
    try {

        const newAsset=req.body.assetID;
        const newSensorData=req.body.sensorData;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(newAsset,newWeight,org==="org1");
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

        
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }

        statefulTxn = contractOrg.createTransaction('UpdateSensorData');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(newAsset,newSensorData);
        console.log(`Asset was updated`);
        result = await contractOrg.evaluateTransaction('ReadAssetWithExpiration',newAsset);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result);
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to Update Asset : ${error}`);
        // res.end(Buffer.from(error));
       
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
    }
}
);


/**Delete Asset  */
router.post('/postDeleteAsset', async function  (req,res) {

   


    console.log("post delete of asset works");
    try {
    
        const assetToDelete=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToDelete,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        let temp,objSent;
        temp={
            success:"",
            exists:"",
            owner:""
        }
        result = await contractOrg.evaluateTransaction('AssetExists',assetToDelete);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            statefulTxn = contractOrg.createTransaction('DeleteAsset');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDelete);
            console.log(`Asset was deleted`);
            temp.success="true";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }else{
            temp.exists="false";
            objSent=Buffer.from(JSON.stringify(temp))
            res.end(objSent);
        }
        //returns false if it doesnt exist
        
        
        
        
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to delete transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
    }
}
);

/**Delete Buy Request */
router.post('/postDeleteBuyRequest',async function (req,res) {
    
    try{
        
        const assetToDeleteBuyRequest=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToDeleteBuyRequest,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
            console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetToDeleteBuyRequest);
            statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDeleteBuyRequest,assetCollection);
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
            console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetToDeleteBuyRequest);
            statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
            statefulTxn.setEndorsingOrganizations(mspOrg);
            result = await statefulTxn.submit(assetToDeleteBuyRequest,sharedCollectionOrg2Org3);

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }



        let temp,objSent;
        // console.log('\n--> Submit Transaction: DeleteBuyRequest ' + assetID);
        // statefulTxn = contractOrg.createTransaction('DeleteBuyRequest');
        // statefulTxn.setEndorsingOrganizations(mspOrg);
        // result = await statefulTxn.submit(assetID,assetCollection);
        temp={
            success:"true"
        }
        // result = await contractOrg2.evaluateTransaction('ReadRequestToBuy', assetID,assetCollection);
        // console.log(`*** Result: ${(result.toString())}`);
        console.log("successfully delete buiy request");
        objSent=Buffer.from(JSON.stringify(temp))
        res.end(objSent);
        

    }catch(error){
        console.error(`Couldnt delete buy request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             serverError:"error",
        //             errorMessage:"Cannot Delete buy request.",
        //             errorStatus:404

        //         })));



                
    }
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             errorCLI:"error",
        //             errorMessage:error.responses[0].response.message,
        //             errorStatus:error.responses[0].response.status

        //         })));
    }


);


/**Delete bid from implicit collection. Might have to implement a receipt*/
router.post('/postDeleteBidRequest',async function (req,res) {
    
    try{
        
        const assetToDeleteBidRequest=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToDeleteBidRequest,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });

        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });


            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }



        let temp,objSent;
        result = await contractOrg.evaluateTransaction('GetAssetBidPrice', assetToDeleteBidRequest);
        console.log('\n--> Submit Transaction: DeleteBidRequest ' + assetToDeleteBidRequest);
        statefulTxn = contractOrg.createTransaction('DeleteBidRequest');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(assetToDeleteBidRequest);
        temp={
            success:"true"
        }

        console.log("successfully deleted bid request");
        objSent=Buffer.from(JSON.stringify(temp))
        res.end(objSent);
        

    }catch(error){
        console.error(`Couldnt delete bid request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Bid price does not exist",//error.responses[0].response.message,
                    errorStatus:500,//error.responses[0].response.status 
                    errorTemp:error
                })));
    }
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             errorCLI:"error",
        //             errorMessage:error.responses[0].response.message,
        //             errorStatus:error.responses[0].response.status

        //         })));
    }


);

/**Asset Exists  */
router.post('/postAssetExists', async function  (req,res) {

    try {

        const assetToSearch=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToSearch,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        statefulTxn = contractOrg.createTransaction('AssetExists');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(assetToSearch);
        console.log(`Asset exists : `,result);
        let flag=(result.toString()==="true");
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //might have to delete
        
        if(flag){
            result = await contractOrg.evaluateTransaction('ReadAssetWithExpiration',assetToSearch)//'asset1');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            //the asset can be read
            res.end(result);
        }else{
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"Asset doesn't exist",
                        errorStatus:500
    
                    })));
        }
        
       

        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" The asset doesn't exist.",
                    errorStatus:500,
                    errorTemp:error

                })));
        // process.exit(1);
    }
}
);





/** Read asset for all orgs */

router.post('/postReadAsset', async function  (req,res) {
console.log("post read works")
    try {


        const assetToRead=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToRead,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        result = await contractOrg.evaluateTransaction('ReadAsset',assetToRead)//'asset1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.end(result.toString());//.toString()
        // Disconnect from the gateway.
        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" The asset doesn't exist.",
                    errorStatus:500,
                    errorTemp:error

                })));
    }
}
);



/*Get all assets */
router.get('/farmerFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
        const gatewayOrg1 = await initContractFromOrg1Identity();
        const networkOrg1 = await gatewayOrg1.getNetwork(channelName);
        const contractOrg1 = networkOrg1.getContract(chaincodeName);
        contractOrg1.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });


        result = await contractOrg1.evaluateTransaction('GetAllAssetsExpiration')
        let flag=(result.toString()==="");
        console.log(`Transaction has been evaluated, result is: ${result.toString()} and flag is ${flag}`);
        //might have to delete
        
        if(flag){
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"World State is empty.",
                        errorStatus:500
    
                    })));
            //the asset can be read
            
        }else{
            res.end(result);
        }
        //res.end(result);//.toString()
        // Disconnect from the gateway.
        gatewayOrg1.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/retailerFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
        const gatewayOrg2 = await initContractFromOrg2Identity();
        const networkOrg2 = await gatewayOrg2.getNetwork(channelName);
        const contractOrg2 = networkOrg2.getContract(chaincodeName);
        contractOrg2.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        

        result = await contractOrg2.evaluateTransaction('GetAllAssetsExpiration')
        let flag=(result.toString()==="");
        console.log(`Transaction has been evaluated, result is: ${result.toString()} and flag is ${flag}`);
        //might have to delete
        
        if(flag){
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"World State is empty.",
                        errorStatus:500
    
                    })));
            //the asset can be read
            
        }else{
            res.end(result);
        }
        gatewayOrg2.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);
router.get('/supermarketFrontPage/getAllAssets', async function  (req,res) {

    try {


        /** ~~~~~~~ Fabric client init: Using Org3 identity to Org3 Peer ~~~~~~~ */
        const gatewayOrg3 = await initContractFromOrg3Identity();
        const networkOrg3 = await gatewayOrg3.getNetwork(channelName);
        const contractOrg3 = networkOrg3.getContract(chaincodeName);
        contractOrg3.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });


        result = await contractOrg3.evaluateTransaction('GetAllAssetsExpiration')
        let flag=(result.toString()==="");
        console.log(`Transaction has been evaluated, result is: ${result.toString()} and flag is ${flag}`);
        //might have to delete
        
        if(flag){
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"World State is empty.",
                        errorStatus:500
    
                    })));
            //the asset can be read
            
        }else{
            res.end(result);
        }
        gatewayOrg3.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end();
        // process.exit(1);
    }
}
);

/* Get Asset History */
router.post('/postGetAssetHistory',async function (req,res){
    try {


        const assetToRead=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToRead,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        result = await contractOrg.evaluateTransaction('GetAssetHistory',assetToRead);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(result.length);
        if(result.length===0){
            res.end(
                Buffer.from(
                    JSON.stringify(
                        {
                            empty:"true",
                            message:"Not found"
                        }
                    )
                )
            )
        }
        res.end(result.toString());//.toString()
        
        // Disconnect from the gateway.
        gatewayOrg.disconnect;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"Some error occured with status: ",
                    errorMessage:" Server Unavailable",
                    errorStatus:500,
                    errorTemp:error

                })));
    }
});




/* Set Price For Asset*/
// For now only org1 and org2 can do it
router.post('/postSetPrice',async function (req,res){
    try{
        
        const assetToSell=req.body.assetID;
        const priceToSell=parseInt(req.body.price);//need integer for it
        const tradeId=globalTradeID++;//parseInt(req.body.tradeID);
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToSell,org,priceToSell,tradeId);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        
            // Agree to a sell by Org1
        const asset_price = {
            asset_id: assetToSell,
            price: priceToSell,
            trade_id: tradeId,
            salt: require('crypto')
            .createHash('sha256')
            .update(assetToSell+priceToSell+tradeId.toString())
            .digest('hex') //Buffer.from(tradeId).toString('hex')
        };
        const asset_price_string =  Buffer.from(JSON.stringify(asset_price));
        console.log(`--> Submit Transaction: setPrice, ${assetToSell} as ${org} - endorsed by ${org}`);
        let response={
            setPrice:"",
            getSalesPrice:""
        }
        transaction = contractOrg.createTransaction('SetPrice');
        transaction.setEndorsingOrganizations(mspOrg);
        transaction.setTransient({
            asset_price:asset_price_string
        });
        await transaction.submit(assetToSell);
        console.log(`*** Result: committed, ${org} has agreed to sell asset ${assetToSell} for ${priceToSell}`);
        response.setPrice="success";

        console.log('\n--> Evaluate Transaction: GetAssetSalesPrice ' + assetToSell);
        result = await contractOrg.evaluateTransaction('GetAssetSalesPrice', assetToSell);
        response.getSalesPrice="success";
        console.log(result)
        res.end(result)
    }catch(error){
        console.error(`Failed to evaluate transaction: ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             errorCLI:"error",
        //             errorMessage:"Couldn't complete transaction.",
        //             errorStatus:500

        //         })));
    }

});



/**Agree To Buy can be done only from Org2 and 3, client not implemented yet */
router.post('/postAgreeToBuy',async function (req,res) {
    
    try{
        
        const assetToBuy=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToBuy,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }


        console.log(`===========Here we are going to AgreeToBuy as ${org}===================`);
        // Agree to a buy by Org2
		console.log(`--> Submit Transaction: AgreeToBuy, ${assetToBuy} as ${org} - endorsed by  ${org}`);
		transaction = contractOrg.createTransaction('AgreeToBuy');
		transaction.setEndorsingOrganizations(mspOrg);//mspOrg1
		await transaction.submit(assetToBuy);
		console.log(`*** Result: committed, ${org} has agreed to buy asset ${assetToBuy}`);


        console.log('\n--> Evaluate Transaction: GetAssetBidPrice ' + assetToBuy);
        result = await contractOrg.evaluateTransaction('GetAssetBidPrice', assetToBuy);
        console.log(result)
        res.end(result);

    }catch(error){
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status 
    
                })));
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             serverError:"error",
        //             errorMessage:"Cannot read buy request.",
        //             errorStatus:404

        //         })));
    }
}

);



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/* Request To Buy asset only Org2 and Org3 can do this,might have to add client case to buy from supermarket */

router.post('/postRequestToBuy',async function (req,res) {

    try{

        const assetToBuy=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        let flag=true;
        console.log(assetToBuy,org);
        // if(org==="org1"){
        //     gatewayOrg = await initContractFromOrg1Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg1;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        //}else 
        if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
        }else if(org==="org3"){
            flag=false;
            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        result = await contractOrg.evaluateTransaction('AssetExists',assetToBuy);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        if(result.toString()==="true"){
            //make request to buy it,might have to do this before org1 sets price
            transaction = contractOrg.createTransaction('RequestToBuy');
            transaction.setEndorsingOrganizations(mspOrg);
            await transaction.submit(assetToBuy);
            console.log("passed first transaction");
            
            //we are going to read the submitted request from user and since
            // its Org2 reading its' own buy request
            if(flag){
                result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToBuy,assetCollection);
            }else{
                result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToBuy,sharedCollectionOrg2Org3);
            }

            console.log(result.toString())
            res.end(result)
        }else{
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        serverError:"Error occured with status: ",
                        errorMessage:" Asset does not exist.",
                        errorStatus:500
                        
    
                    })));
        }

    
    }catch(error){
        console.error(`failed to create buy request ${error}`);
        // res.end( Buffer.from(
        //     JSON.stringify(
        //         {
        //             serverError:"Error occured with status: ",
        //             errorMessage:" Server Unavailable",
        //             errorStatus:500,
        //             errorTemp:error

        //         })));
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status

                })));

    }
    

});

/** Transfer Requested asset. It's available only for Farmers and retailers. Client supermarket not implemented yet */

router.post('/postTransferRequestedAsset',async function (req,res) {
    
    try{
        const assetToTransfer=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        console.log(assetToTransfer,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
        
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }

        console.log('\n--> Submit Transaction: TransferRequestedAsset ' + assetToTransfer);
        statefulTxn = contractOrg.createTransaction('TransferRequestedAsset');
        statefulTxn.setEndorsingOrganizations(mspOrg);
        result = await statefulTxn.submit(assetToTransfer);

        console.log(`\n--> We are going to read asset after it has been transfered}`);
        result = await contractOrg.evaluateTransaction('ReadAssetWithExpiration', assetToTransfer);
        console.log(`*** Result: ${(result.toString())}`);
        res.end(result);

    }catch(error){
        //better error handling !!!!
        //better messages
        console.error(`Couldnt tranfer requested asset ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    errorCLI:"error",
                    errorMessage:error.responses[0].response.message,
                    errorStatus:error.responses[0].response.status

                })));
    }
}

);


/** Read Buy Request ,might have to add relation of client and supermarket,
 * Only org1 and org2 can do this, maybe org3 can do it for it's own buy request?
*/
router.post('/postReadBuyRequest',async function (req,res) {
    try{
        console.log("gets in read buy request");
        const assetToReadBuyRequest=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        //Console log of parameters
        console.log(assetToReadBuyRequest,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
            result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToReadBuyRequest,assetCollection);
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
            result = await contractOrg.evaluateTransaction('ReadRequestToBuy', assetToReadBuyRequest,sharedCollectionOrg2Org3);
         //}else if(org==="org3"){

        //     gatewayOrg = await initContractFromOrg3Identity();
        //     networkOrg = await gatewayOrg.getNetwork(channelName);
        //     contractOrg = networkOrg.getContract(chaincodeName);
        //     mspOrg=mspOrg3;
        //     contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });

            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        console.log('\n~~~~~~~~~~~~~~~ Reading Request To Buy ');
        console.log(result.toString()==="",result)
        if(result.toString()===""){
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        exists:"false",
                        errorMessage:"Buy Request couldn't be found.",
                        errorStatus:404
    
                    })));
        }else{
            res.end(result)
        }
        
    
    }catch(error){
        console.error(`failed to read buy request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Cannot read buy request.",
                    errorStatus:404

                })));
    }

});



/** ReadAssetPrice ,might have to add relation of client and supermarket,
 * Org2 and Org3 have to use it to see if there is a price for an asset that they want to buy.
 * It's going to be used only to see if a price is available when orgs are buyers. That's why
 * Org2 looks for it on the shared asset collection with org1 , and org3 looks for shared 
 * collection on org3 and org2 one. Org2 could read from org2 and org3 collection but there is no need for that since in that scenarion org2 is the seller and has the price in it's implicit data collection
*/
router.post('/postReadAssetPrice',async function (req,res) {
    try{

        const assetToReadPrice=req.body.assetID;
        const org=req.body.org;
        let  gatewayOrg;
        let networkOrg;
        let contractOrg;
        let mspOrg;
        let temp;
        //Console log of parameters
        console.log(assetToReadPrice,org);
        if(org==="org1"){
            gatewayOrg = await initContractFromOrg1Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg1;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection] });
            result = await contractOrg.evaluateTransaction('ReadAssetPrice', assetToReadPrice,assetCollection);
            temp=assetCollection;
        }else if (org==="org2"){
            gatewayOrg = await initContractFromOrg2Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg2;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [assetCollection, sharedCollectionOrg2Org3] });
            result = await contractOrg.evaluateTransaction('ReadAssetPrice', assetToReadPrice,assetCollection);
            temp=assetCollection;
         }else if(org==="org3"){

            gatewayOrg = await initContractFromOrg3Identity();
            networkOrg = await gatewayOrg.getNetwork(channelName);
            contractOrg = networkOrg.getContract(chaincodeName);
            mspOrg=mspOrg3;
            contractOrg.addDiscoveryInterest({ name: chaincodeName, collectionNames: [sharedCollectionOrg2Org3] });
            result = await contractOrg.evaluateTransaction('ReadAssetPrice', assetToReadPrice,sharedCollectionOrg2Org3);
            temp=sharedCollectionOrg2Org3;
            
        }else{
            console.log("No org was given. Can't connect to any profiles");
            res.end( Buffer.from(
                JSON.stringify(
                    {
                        errorCLI:"error",
                        errorMessage:"No org was given. Can't connect to any profiles",
                        errorStatus:404
    
                    })));
        }
        console.log(`\n~~~~~~~~~~~~~~~ Reading price as ${org} from ${temp} `);
        console.log(result.toString())
        res.end(result)
    
    }catch(error){
        console.error(`failed to read buy request ${error}`);
        res.end( Buffer.from(
            JSON.stringify(
                {
                    serverError:"error",
                    errorMessage:"Price for ",
                    errorStatus:500
                })));
    }

});

module.exports = router;

