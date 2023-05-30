import React, { useState } from "react";

import Error from "../Templates/Error";
import PrintAssets from "../Templates/PrintAssets";
import Input from "../Templates/Input";
import Loading from "../Templates/Loading";
import { handlePost } from "../helper/helper";
import SubmitButton from "../Templates/SubmitButton";
import BackButton from "../Templates/BackButton";

function CreateAsset() {
  const [formInputWeight, setFormInputWeight] = useState("");
  const [formInputType, setFormInputType] = useState("");
  const [postReply, setPostReply] = useState([]);
  const [loading, setLoading] = useState(undefined);

  function handleWeightChange(e) {
    setFormInputWeight(e.target.value);
  }
  function handleInputChange(e) {
    setFormInputType(e.target.value);
  }

  function fetchPostReply() {
    console.log("fetch runs");
    const formData = {
      weight: formInputWeight,
      assetType: formInputType,
    };

    let link = "/createAssetData";
    handlePost(formData, link, setPostReply, setLoading);
  }

  let disabled = !(formInputType !== "" && formInputWeight !== "");
  return (
    <div className="container justify-content-center p-5 ">
      {!loading && (
        <div>
          <h1 className="mt-5">CreateAsset</h1>
          <Input
            label={"Asset Type"}
            type={"text"}
            handleChange={handleInputChange}
            id={"assetID"}
            placeholder={"asset#"}
          />
          <Input
            label={"Weight"}
            type={"number"}
            handleChange={handleWeightChange}
            id={"weight"}
            placeholder={"weight#"}
          />
          <SubmitButton
            buttonText={"Create"}
            fetchPostReply={fetchPostReply}
            disabled={disabled}
          />
        </div>
      )}

      <div>
        {loading ? (
          <Loading />
        ) : !loading && postReply.expirationTime ? (
          <div className="mx-auto container-fluid p-5">
            <div className="d-block p-5">
              <h3>
                You created {postReply.asset_obj.ID} with the following details:{" "}
              </h3>
            </div>
            <div
              className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 "
            >
              <PrintAssets
                ID={postReply.asset_obj.ID}
                weight={postReply.asset_obj.weight}
                owner={postReply.asset_obj.owner}
                creator={postReply.asset_obj.creator}
                expirationDate={postReply.asset_obj.expirationDate}
                sensorData={postReply.asset_obj.sensorData}
                ownerOrg={postReply.asset_obj.ownerOrg}
                assetType={postReply.asset_obj.assetType}
                daysLeft={postReply.expirationTime}
                creationTimestamp={postReply.asset_obj.timestamp}
              />
            </div>
            <hr />
            <BackButton link={"/farmerFrontPage"} />
   
          </div>
        ) : postReply.errorCLI ? (
          <Error
            message={
              " Error with status " +
              postReply.errorStatus +
              ". " +
              postReply.errorMessage[0].toUpperCase() +
              postReply.errorMessage.slice(1) +
              "."
            }
            backlink="farmerFrontPage"
          />
        ) : (
          <Error
            message="Plese enter assetID to continue or go back."
            backlink="farmerFrontPage"
          />
        )}
      </div>
    </div>
  );
}

export default CreateAsset;
