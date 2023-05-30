import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function TransferRequestedAsset(props) {


    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


    const [formInputID,setFormInputID]=useState('');
    const [postReply, setPostReply] = useState([]);
   

    let fetchAttempt=false;
    useEffect( () => {     
        
 
        fetchPostReply();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPostReply ()  {

        fetchAttempt= !fetchAttempt;
        const formData={
            assetID:formInputID,
            org:props.org,
            
        }
      
       
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        };  
        
        //cant fetch any data if everythign is not in place
        if(formData.assetID !=="" && formData.buyerMSP!==""){
            const response = await fetch('/postTransferRequestedAsset',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    }; 
   

    
    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Transfer Asset</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Transfer </button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.expirationTime ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>You transfered {postReply.asset_obj.ID} to {postReply.asset_obj.owner}: </h3>
                        </div>      
                        <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                        
                                <PrintAssets ID={postReply.asset_obj.ID}  weight={postReply.asset_obj.weight} owner={postReply.asset_obj.owner} creator={postReply.asset_obj.creator} expirationDate={postReply.asset_obj.expirationDate} assetType={postReply.asset_obj.assetType} ownerOrg={postReply.asset_obj.ownerOrg} daysLeft={postReply.expirationTime} creationTimestamp={postReply.asset_obj.timestamp}/>
                            
                        </div> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                    ) : postReply.errorCLI ? ( 
                        <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back} />
                    ): postReply.serverError ?(
                        <Error message={postReply.serverError+" "+postReply.errorStatus+". "+postReply.errorMessage} backlink={back} />
                    ):(
                        <Error message="Plese enter assetID and buyer MSP to sell the asset. This should be done after both have agreed on price.Otherwise returns error. " backlink={back} />
                    )
                    }
            </div>
    
        </div>
    );


    // //show only if assets are available
    // //maybe i can do it with react ex <GoBack props="/frontpge" />
    // var count = Object.keys(items).length;
    // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // console.log("this is the size of count",count)
    

    // if(items.ID){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>Successfully transfered {items.ID} to {items.owner}.New asset details are: </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p class="text-center d-block"><a href={back} class="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error message="Something went wrong ." backlink="/farmerFrontPage" />
    // );



}
 export default TransferRequestedAsset;