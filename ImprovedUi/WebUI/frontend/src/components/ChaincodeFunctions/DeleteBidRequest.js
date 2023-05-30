import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import { handlePost } from '../helper/helper';
import SubmitButton from '../Templates/SubmitButton';
import Input from '../Templates/Input';

function DeleteBidRequest(props) {

    
    let back;//link to go back to home page 

    if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


    const [formInputID,setFormInputID]=useState('');
    const [postReply, setPostReply] = useState([]);
    const [loading, setLoading]  = useState(undefined);

    function handleChange(e){
        setFormInputID(e.target.value);
    }
    function fetchPostReply ()  {


        const formData={
            assetID:formInputID,
            org:props.org
        }
      let link = '/postDeleteBidRequest';
      handlePost(formData,link,setPostReply,setLoading);

    };



    let disabled = formInputID ==="";
    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Delete Bid Request</h1>
            <Input 
              label={"Asset ID"}
              type={"text"}
              handleChange={handleChange}
              id={"assetID"}
              placeholder={"asset#"}
            />

            <SubmitButton 
              buttonText={"Delete Bid"}
              fetchPostReply={fetchPostReply}
              disabled={disabled}
            />

        
    
            <div>
                {postReply.success==="true" ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3> Your bid request details: </h3>
                        </div>      
                        <section>
                        
                            <Error message="Bid request deleted successfully." backlink={back} />
                            
                        </section> 
                        <hr />
                    
                    </div>
                ) : postReply.errorCLI ? ( 
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+" for "+formInputID+"."}backlink={back}/>
                ):(
                    <Error message="Plese enter assetID to delete its' bid request." backlink={back} />
                )
                }
            </div>
    
        </div>
    );


    // var count = Object.keys(items).length;
    // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // console.log("this is the size of count",count,items)
    // if(items.success==="true"){
    //     return(
            
            
    //         <Error message="Buy request deleted successfully." backlink={back} />
            
            
    //     );
    // }

    // return(
    //     <div>
            
    //         <Error message="Couldn't delete buy request. You are not the buyer." backlink={back} />
    //     </div>
    // );




}

export default DeleteBidRequest;