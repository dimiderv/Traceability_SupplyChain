import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function ReadAsset(props) {

    
    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }


  //  const [items, setItems] = useState([]);

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
            const response = await fetch('/postReadAsset',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };
    console.log(postReply);



    

    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Read Asset Details</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Read Asset Details</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.ID ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>The {postReply.ID}  details are: </h3>
                        </div>      
                        <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                        
                                <PrintAssets ID={postReply.asset_obj.ID}  weight={postReply.asset_obj.weight} owner={postReply.asset_obj.owner} creator={postReply.asset_obj.creator} expirationDate={postReply.asset_obj.expirationDate} sensorData={postReply.asset_obj.sensorData} ownerOrg={postReply.asset_obj.ownerOrg} assetType={postReply.asset_obj.assetType} daysLeft={postReply.expirationTime}/>
                            
                        </div> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                ) : postReply.errorCLI ? ( 
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={postReply.serverError+postReply.errorStatus+". "+postReply.errorMessage} backlink={back} />
                ):(
                    <Error message="Plese enter assetID to read details." backlink={back} />
                )
                }
            </div>
    
        </div>
    );

    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    // if(items.length){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>These are the assets </h3>
    //             </div>      
    //             <section>
    //                 { 
    //                 items.map(item => (
    //                     <PrintAssets ID={item.ID} color={item.color} weight={item.weight} owner={item.owner} creator={item.creator} expirationDate={item.expirationDate} />
    //                 ))
    //                 }
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p className="text-center d-block"><a href="/farmerFrontPage" className="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error backlink="farmerFrontPage" />
    // );
    


}

export default ReadAsset;