import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
/* User front Pages */
import FarmerFrontPage from './components/FarmerFrontPage';
import RetailerFrontPage from './components/RetailerFrontPage';
import SupermarketFrontPage from './components/SupermarketFrontPage';

/* Chaincode Functions */
import InitLedger from './components/ChaincodeFunctions/InitLedger';
import CreateAsset from './components/ChaincodeFunctions/CreateAsset';
import UpdateAsset from './components/ChaincodeFunctions/UpdateAsset';
import DeleteAsset from './components/ChaincodeFunctions/DeleteAsset';
import SetPrice from './components/ChaincodeFunctions/SetPrice';
import RequestToBuy from './components/ChaincodeFunctions/RequestToBuy';
import TransferRequestedAsset from './components/ChaincodeFunctions/TransferRequestedAsset';
import AgreeToBuy from './components/ChaincodeFunctions/AgreeToBuy';
import DeleteBuyRequest from './components/ChaincodeFunctions/DeleteBuyRequest';
import UpdateSensorData from './components/ChaincodeFunctions/UpdateSensorData';
import DeleteBidRequest from './components/ChaincodeFunctions/DeleteBidRequest';

/* Queries */
import ReadAsset from './components/ChaincodeFunctions/ReadAsset';
import GetAllAssets from './components/ChaincodeFunctions/GetAllAssets';
import AssetExists from './components/ChaincodeFunctions/AssetExists';
import GetAssetHistory from './components/ChaincodeFunctions/GetAssetHistory';
import ReadBuyRequest from './components/ChaincodeFunctions/ReadBuyRequest';
import ReadAssetPrice from './components/ChaincodeFunctions/ReadAssetPrice';

function App() {
  return (
    <Router>
      <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            {/* Farmer related functions */}
            <Route path="/farmerFrontPage" exact component={FarmerFrontPage} />
            <Route path="/initLedger" exact component={InitLedger} />
            <Route exact path="/createAsset"  component={CreateAsset} />
            <Route exact path="/farmerFrontPage/readAsset">
              <ReadAsset org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/getAllAssets" >
              <GetAllAssets org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/updateAsset" >
              <UpdateAsset org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/updateSensorData" >
              <UpdateSensorData org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/deleteAsset" >
              <DeleteAsset org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/assetExists" >
              <AssetExists org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/getAssetHistory" >
              <GetAssetHistory org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/setPrice" >
              <SetPrice org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/readBuyRequest" >
              <ReadBuyRequest org="org1"/>
            </Route>
            <Route exact path="/farmerFrontPage/transferRequestedAsset" >
              <TransferRequestedAsset org="org1"/>
            </Route>

            {/* Retailer related functions */}
            <Route path="/retailerFrontPage" exact component={RetailerFrontPage} />
            <Route exact path="/retailerFrontPage/readAsset">
              <ReadAsset org="org2"/>
            </Route>
            <Route  exact path="/retailerFrontPage/getAllAssets" >
              <GetAllAssets org="org2" />
            </Route>
            <Route exact path="/retailerFrontPage/updateAsset" >
              <UpdateAsset org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/updateSensorData" >
              <UpdateSensorData org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/deleteAsset" >
              <DeleteAsset org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/assetExists" >
              <AssetExists org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/getAssetHistory" >
              <GetAssetHistory org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/requestToBuy" >
              <RequestToBuy org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/readBuyRequest" >
              <ReadBuyRequest org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/setPrice" >
              <SetPrice org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/transferRequestedAsset" >
              <TransferRequestedAsset org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/agreeToBuy" >
              <AgreeToBuy org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/deleteBuyRequest" >
              <DeleteBuyRequest org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/deleteBidRequest" >
              <DeleteBidRequest org="org2"/>
            </Route>
            <Route exact path="/retailerFrontPage/readAssetPrice">
              <ReadAssetPrice org="org2"/>
            </Route>
            
            {/* Supermarket related functions */}
            <Route path="/supermarketFrontPage" exact component={SupermarketFrontPage} />
            <Route exact path="/supermarketFrontPage/readAsset">
              <ReadAsset org="org3"/>
            </Route>
            <Route  exact path="/supermarketFrontPage/getAllAssets" >
              <GetAllAssets org="org3" />
            </Route>
            <Route exact path="/supermarketFrontPage/updateAsset" >
              <UpdateAsset org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/updateSensorData" >
              <UpdateSensorData org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/deleteAsset" >
              <DeleteAsset org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/assetExists" >
              <AssetExists org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/getAssetHistory" >
              <GetAssetHistory org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/requestToBuy" >
              <RequestToBuy org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/deleteBuyRequest" >
              <DeleteBuyRequest org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/deleteBidRequest" >
              <DeleteBidRequest org="org3"/>
            </Route>
            {/* Might not use set price for org3. In handler i dont use it */}
            <Route exact path="/supermarketFrontPage/setPrice" >
              <SetPrice org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/agreeToBuy" >
              <AgreeToBuy org="org3"/>
            </Route>
            <Route exact path="/supermarketFrontPage/readAssetPrice">
              <ReadAssetPrice org="org3"/>
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
