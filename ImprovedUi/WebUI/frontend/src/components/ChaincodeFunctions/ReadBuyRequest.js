import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintBuyRequest from '../Templates/PrintBuyRequest';


function ReadBuyRequest(props) {


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
            org:props.org
        }
      
       
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        };  
        
        //cant fetch any data if everythign is not in place
        if(formData.assetID !=="" ){
            const response = await fetch('/postReadBuyRequest',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };

    



    
    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Read Buy Request </h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Read Buy Request</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.assetID ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3> The buy request details: </h3>
                        </div>      
                        <section>
                        
                            <PrintBuyRequest assetID={postReply.assetID} buyerID={postReply.buyerID} buyerMSP={postReply.buyerMSP} timestamp={postReply.timestamp} txId={postReply.txId} salt={postReply.salt}/>
                            
                        </section> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                ) : postReply.errorCLI ? ( 
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={postReply.serverError+postReply.errorStatus+". "+postReply.errorMessage} backlink={back} />
                ):postReply.exists==="false" ?(
                    <Error message={"Request to buy for "+formInputID+" does not exist"} backlink={back} />
                ):(
                    <Error message="See if there are any buy requests using assets ID" backlink={back} />
                )
                }
            </div>
    
        </div>
    );

    // var count = Object.keys(items).length;
    // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // console.log("this is the size of count",count)
    // if(items.assetID){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3> The requesting Buyers details: </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintBuyRequest assetID={items.assetID} buyerID={items.buyerID}/>
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error message="Something went wrong.Request to Buy couldn't be submitted."backlink={back} />
    // );


    


}

export default ReadBuyRequest;