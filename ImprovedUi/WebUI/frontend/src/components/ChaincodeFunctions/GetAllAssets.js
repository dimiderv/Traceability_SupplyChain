import React, { useEffect, useState } from "react";
// import {Link} from 'react-router-dom';
import Error from "../Templates/Error";
import PrintAssets from "../Templates/PrintAssets";
import Loading from "../Templates/Loading";
import { handleGetFetch } from "../helper/helper";
import BackButton from "../Templates/BackButton";

function GetAllAssets(props) {
  const orgLink = "/";
  let temp;
  let back; //link to go back to home page
  if (props.org === "org1") {
    back = "/farmerFrontPage"; //assigning values like this doesnt work
    temp = "farmerFrontPage/getAllAssets";
  } else if (props.org === "org2") {
    back = "/retailerFrontPage";
    temp = "retailerFrontPage/getAllAssets";
  } else {
    back = "/supermarketFrontPage";
    temp = "supermarketFrontPage/getAllAssets";
  }
  const link = orgLink + temp;
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(undefined);

  useEffect(() => {
    handleGetFetch(link, setItems, setDone);
  }, [link]);

  // console.log(items.errorCLI)

  var count = Object.keys(items).length;
  //this covers the case were we have only one asset
  if (!done) {
    return <Loading />;
  } else if (items.expirationTime) {
    return (
      <div className="mx-auto container-fluid p-5">
        <div className="d-block p-5">
          <h3>This is the current asset </h3>
        </div>
        <section>
          <PrintAssets
            key={items.asset_obj.ID}
            ID={items.asset_obj.ID}
            weight={items.asset_obj.weight}
            owner={items.asset_obj.owner}
            creator={items.asset_obj.creator}
            expirationDate={items.asset_obj.expirationDate}
            sensorData={items.asset_obj.sensorData}
            assetType={items.asset_obj.assetType}
            ownerOrg={items.asset_obj.ownerOrg}
            daysLeft={items.expirationTime}
            creationTimestamp={items.asset_obj.timestamp}
          />
        </section>
        <hr />
        <BackButton link={back} />
      </div>
    );
  } else if (items.errorCLI === "error") {
    <Error message={items.errorMessage} backlink={back} />;
  } else if (count) {
    return (
      <div className="d-block p-5 bg-light">
        <div className="d-block p-5">
          <h3>These are the assets </h3>
        </div>

        <div
          className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 "
        >
          {items.map((item) => (
            <PrintAssets
              key={item.asset_obj.ID}
              ID={item.asset_obj.ID}
              weight={item.asset_obj.weight}
              owner={item.asset_obj.owner}
              creator={item.asset_obj.creator}
              expirationDate={item.asset_obj.expirationDate}
              sensorData={item.asset_obj.sensorData}
              assetType={item.asset_obj.assetType}
              ownerOrg={item.asset_obj.ownerOrg}
              daysLeft={item.expirationTime}
              creationTimestamp={item.asset_obj.timestamp}
            />
          ))}
        </div>
        <BackButton link={back} />
      </div>
    );
  } else {
    return (
      <Error
        message="Something went wrong . Couldn't read all assets available"
        backlink={back}
      />
    );
  }
}

export default GetAllAssets;
