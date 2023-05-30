import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintHistory from '../Templates/PrintHistory';


function GetAssetHistory(props) {
    

 
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
    const [emptyFinal,setEmptyFinal]=useState('');

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
            setPostReply([]);
            const response = await fetch('/postGetAssetHistory',options);
            const json = await response.json();
            console.log(json.empty)
            if(json.empty==="true"){
                console.log()
                setPostReply(json);
            }else{
                let finalHistory=[];
                let history=json;//=JSON.parse(bufferOriginal.toString('utf8'));
                for (const i in history ) {
                    if(history[i].isDelete===true){
                        //flag=true
                        break
                    }else{
                        finalHistory.push(history[i])
                    }
                    //console.log("this is final hiustory on iteration ",i ,finalHistory.reverse())
                }
                if(finalHistory.length){
                    setPostReply(finalHistory.reverse());
                }else{
                    setEmptyFinal("empty")
                }   
                
                console.log("final history ",finalHistory)
            }

            
           
        }
 
        

    };

   // console.log(postReply)
    var count = Object.keys(postReply).length;
    //console.log("ITEMS,",count,postReply,"ITEMS[0]",postReply[0],"ITEMS.RECORD",postReply)

    return(
        // container keeps form input small but fluid fixes cards
        <div className="container-fluid justify-content-center p-5 ">
            <h1 className="mt-5">Get Asset History</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID  {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-50 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    

    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Get History</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div >
                {count===1 ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>The {postReply[0].record.ID} exists with history: </h3>
                        </div>      
                        <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                        
                                <PrintHistory ID={postReply[0].record.ID} weight={postReply[0].record.weight} owner={postReply[0].record.owner} creator={postReply[0].record.creator} expirationDate={postReply[0].record.expirationDate}  sensorData={postReply[0].record.sensorData} assetType={postReply[0].record.assetType} ownerOrg={postReply[0].record.ownerOrg} txId={postReply[0].txId} timestamp={postReply[0].timestamp} creationTimestamp={postReply[0].record.timestamp}/>
                            
                        </div> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                ) : count && postReply.empty!=="true"?(
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>These are the assets </h3>
                        </div>      
                        <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                            { 
                            
                            postReply.map(item => (
                                <PrintHistory ID={item.record.ID}  weight={item.record.weight} owner={item.record.owner} creator={item.record.creator} expirationDate={item.record.expirationDate} sensorData={item.record.sensorData} assetType={item.record.assetType} ownerOrg={item.record.ownerOrg} txId={item.txId} timestamp={item.timestamp} creationTimestamp={item.record.timestamp}/>
                            ))
                            }
                        </div> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                   
                    </div>
                ) :postReply.errorCLI ? ( //Error for No connection profile
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                ): postReply.serverError ?(
                    <Error message={postReply.serverError+postReply.errorStatus+". "+postReply.errorMessage} backlink={back} />
                ):formInputID.length>=6 && postReply.empty==="true"  ?(
                    <Error message={"There is no History for " +formInputID+ ". Asset doesn't exist."} backlink={back} />  
                ): emptyFinal==="empty"?(
                    <Error message={"There is no History for " +formInputID+ ". Asset doesn't exist."} backlink={back} />  
                ):(
                    <Error message="Plese enter assetID for deletion or go back" backlink={back} />
                )
                }
            </div>
    
        </div>
    );

    




    

    // var count = Object.keys(items).length;
    // console.log("ITEMS,",count,items,"ITEMS[0]",items[0],"ITEMS.RECORD",items)
    // //this covers the case were we have only one asset
    // if(count===1){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>This is the current asset </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintHistory ID={items[0].record.ID} color={items[0].record.color} weight={items[0].record.weight} owner={items[0].record.owner} creator={items[0].record.creator} expirationDate={items[0].record.expirationDate} txId={items[0].txId} timestamp={items[0].timestamp}  />
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }else if (count){
       
    //         return(
    //             <div className="mx-auto container-fluid p-5">
    //                 <div className="d-block p-5">
    //                     <h3>These are the assets </h3>
    //                 </div>      
    //                 <section>
    //                     { 
    //                     items.map(item => (
    //                         <PrintHistory ID={item.record.ID} color={item.record.color} weight={item.record.weight} owner={item.record.owner} creator={item.record.creator} expirationDate={item.record.expirationDate} txId={item.txId} timestamp={item.timestamp}/>
    //                     ))
    //                     }
    //                 </section> 
    //                 <hr />
    //                 <div>
    //                     <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
    //                 </div>
                   
    //             </div>
    //         );
      
    // }

    // return(
    //     <Error message="Something went wrong . Couldn't find asset History" backlink={back} />
    // );



}

export default GetAssetHistory;