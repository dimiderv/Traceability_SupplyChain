import React, { useEffect, useState } from "react";
// import {Link} from 'react-router-dom';
import Error from "../Templates/Error";
import PrintAssets from "../Templates/PrintAssets";
import Loading from "../Templates/Loading";
import { handleGetFetch } from "../helper/helper";
import BackButton from "../Templates/BackButton";
function InitLedger() {
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(undefined);
  const link = "/initLedger";
  useEffect(() => {
    handleGetFetch(link,setItems, setDone);

  }, []);


  var count = Object.keys(items).length;


  if (!done) {
    return (
        <Loading />
    );
  }else if (count) {
    return (
      <div className="d-block p-5 bg-light">
        <div className="d-block p-5">
          <h3>These are the initialized assets </h3>
        </div>

        <div
          className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 "
        >
          {items.map((item) => (
            <PrintAssets key={item.asset_obj.ID}
              ID={item.asset_obj.ID}
              weight={item.asset_obj.weight}
              owner={item.asset_obj.owner}
              creator={item.asset_obj.creator}
              expirationDate={item.asset_obj.expirationDate}
              sensorData={item.asset_obj.sensorData}
              ownerOrg={item.asset_obj.ownerOrg}
              assetType={item.asset_obj.assetType}
              daysLeft={item.expirationTime}
              creationTimestamp={item.asset_obj.timestamp}
            />
          ))}
        </div>
        <BackButton link="/farmerFrontPage" />

      </div>
    );
  }

  return (
    <Error
      message="Something went wrong . Ledger could not be initialized"
      backlink="farmerFrontPage"
    />
  );
}

export default InitLedger;
