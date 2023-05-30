import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintBuyRequest from '../Templates/PrintBuyRequest';


function RequestToBuy(props) {

    
    let back;//link to go back to home page 

    if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


    const [formInputID,setFormInputID]=useState('');
    const [postReply, setPostReply] = useState([]);

    useEffect( () => {     
        
 
        fetchPostReply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function fetchPostReply ()  {


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
            const response = await fetch('/postRequestToBuy',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };
    console.log(postReply);




    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Request To Buy Asset</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Request To Buy</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.assetID ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3> Your buy request details: </h3>
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
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={postReply.serverError+postReply.errorStatus+". "+postReply.errorMessage} backlink={back} />
                ):(
                    <Error message="Plese enter assetID you would like to buy" backlink={back} />
                )
                }
            </div>
    
        </div>
    );


    // // var count = Object.keys(items).length;
    // // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // // console.log("this is the size of count",count)
    // if(postReply.assetID){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3> Your buy request details: </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintBuyRequest assetID={postReply.assetID} buyerID={postReply.buyerID}/>
                    
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

export default RequestToBuy;