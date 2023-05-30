import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
//import PrintAssets from '../Templates/PrintAssets';


function DeleteBuyRequest(props) {

    
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
            const response = await fetch('/postDeleteBuyRequest',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };



    
    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Delete Buy Request</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Delete Buy Request</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.success==="true" ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3> Your buy request details: </h3>
                        </div>      
                        <section>
                        
                            <Error message="Buy request deleted successfully." backlink={back} />
                            
                        </section> 
                        <hr />

                    
                    </div>
                ) : postReply.errorCLI ? ( 
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back}/>
                ):(
                    <Error message="Plese enter assetID to delete its' buy request." backlink={back} />
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

export default DeleteBuyRequest;