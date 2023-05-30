import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintSalesPrice from '../Templates/PrintSalesPrice';


function SetPrice(props) {

    let back;//link to go back to home page 
    if(props.org==="org1"){
       back="/farmerFrontPage"; //assigning values like this doesnt work
    }else if (props.org==="org2"){
        back="/retailerFrontPage";
    }else{
        back="/supermarketFrontPage";
    }
    const [formInputID,setFormInputID]=useState('');
    const [formInputPrice,setFormInputPrice]=useState('');
    //const [formInputTradeID,setFormInputTradeID]=useState('');
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
            price:formInputPrice,
            //tradeID:formInputTradeID,
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
        if(formData.assetID !=="" && formData.price!=="" && formData.tradeID!==""){
            const response = await fetch('/postSetPrice',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };
    



    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">Set selling price for asset</h1>
        
            <div className="form-group w-25 mx-auto">
                <label htmlFor="assetID" className="col-form-label mx-auto">AssetID {formInputID}</label>
                {/* col-xs-3 */}
                <div className="col-sm-10 w-10 mx-auto">
                <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                </div>
            </div>
    
          
            <div className="form-group w-25 mx-auto">
                <label htmlFor="price" className="col-form-label mx-auto">Price {formInputPrice} </label>
                <div className="col-sm-10 mx-auto">
                <input type="text" className="form-control" onChange={e=>setFormInputPrice(e.target.value)} id="price" placeholder="Price"/>
                </div>
            </div>
            {/* <div className="form-group w-25 mx-auto">
                <label htmlFor="tradeId" className="col-form-label mx-auto">Trade ID  {formInputTradeID}</label>
                <div className="col-sm-10 mx-auto">
                <input type="number" className="form-control" onChange={e=>setFormInputTradeID(e.target.value)} id="tradeId" placeholder="tradeId"/>
                </div>
            </div> */}
    
    
            <div className="form-group row d-block">
                <div className="col-sm-12">
                    <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Set Price</button>
                    {/* onClickCapture also worked */}
                </div>
            </div>
        
    
            <div>
                {postReply.asset_id ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>{postReply.asset_id} is for sale: </h3>
                        </div>      
                        <section>
                        
                        <PrintSalesPrice ID={postReply.asset_id} price={postReply.price} tradeID={postReply.trade_id} salt={postReply.salt} />
                            
                        </section> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                    ) : postReply.errorCLI ? ( 
                        <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage+"."}backlink={back} />
                    ):postReply.serverError ?(
                        <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back}/>
                    ):(
                        <Error message="Plese enter assetID and price." backlink={back} />
                    )
                }
            </div>
    
        </div>
    );


    // var count = Object.keys(items).length;
    // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // console.log("this is the size of count",count)
    // if(postReply.asset_id){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>{postReply.asset_id} is for sale </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintSalesPrice ID={postReply.asset_id} price={postReply.price} tradeID={postReply.trade_id} />
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error message="Could not read Sales Price form private collection.Make sure you are the owner of the asset."backlink={back} />
    // );


    


}

export default SetPrice;
