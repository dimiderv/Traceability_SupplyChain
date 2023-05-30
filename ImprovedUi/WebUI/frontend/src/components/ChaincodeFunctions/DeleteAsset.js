import React, { useState } from "react";
import Error from "../Templates/Error";
import { handlePost } from "../helper/helper";
import Input from "../Templates/Input";
import Loading from "../Templates/Loading";
import SubmitButton from "../Templates/SubmitButton";
function DeleteAsset(props) {
  let back; //link to go back to home page
  if (props.org === "org1") {
    back = "/farmerFrontPage"; //assigning values like this doesnt work
  } else if (props.org === "org2") {
    back = "/retailerFrontPage";
  } else {
    back = "/supermarketFrontPage";
  }

  const [formInputID, setFormInputID] = useState("");
  const [postReply, setPostReply] = useState([]);
  const [loading, setLoading] = useState(undefined);

  function handleIdChange(e) {
    setFormInputID(e.target.value);
  }
  function fetchPostReply() {
    const formData = {
      assetID: formInputID,
      org: props.org,
    };

    let link = "/postDeleteAsset";
    handlePost(formData, link, setPostReply, setLoading);
  }

  let disabled = formInputID === "";
  return (
    <div className="container justify-content-center p-5 ">
      {!loading && (
        <div>
          <h1 className="mt-5">Delete Asset</h1>
          <Input
            label={"Asset ID"}
            type={"text"}
            handleChange={handleIdChange}
            id={"assetID"}
            placeholder={"asset#"}
          />
          <SubmitButton
            buttonText={"Delete"}
            fetchPostReply={fetchPostReply}
            disabled={disabled}
          />
        </div>
      )}

      <div>
        {loading ? (
          <Loading />
        ) : !loading && postReply.success === "true" ? (
          <Error message="Asset was deleted successfully." backlink={back} />
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
            backlink={back}
          />
        ) : postReply.exists === "false" ? (
          <Error message="Asset doesn't exist." backlink={back} />
        ) : (
          <Error
            message="Plese enter assetID to continue or go back"
            backlink={back}
          />
        )}
      </div>
    </div>
  );
}

export default DeleteAsset;
