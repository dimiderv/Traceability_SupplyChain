import React, {useState} from 'react';
import {useEffect } from 'react';


//import {Link} from 'react-router-dom';
import Error from './Templates/Error';
import PrintAssets from './Templates/PrintAssets';


function ShowPost() {    
    const [formInputID,setFormInputID]=useState('');
    const [formInputWeight,setFormInputWeight]=useState('');
    const [formInputColor,setFormInputColor]=useState('');
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
            weight:formInputWeight,
            color:formInputColor
        }
      
       
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(formData)
        };  
        
        //cant fetch any data if everythign is not in place
        if(formData.assetID !=="" && formData.weight!=="" && formData.color!==""){
            const response = await fetch('/createAssetInput',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };
    
    // async function waitForm(){
    //     fetchItems()
    // };

    console.log(fetchAttempt)


    //show only if assets are available
    //maybe i can do it with react ex <GoBack props="/frontpge" />
    // var count = Object.keys(items).length;
    // console.log("this is the length ",count," this is the type of items ", typeof items, " length of items.id",items.ID)
    // console.log("this is the size of count",count)
    

    return(
        <div className="container justify-content-center p-5 ">
            <h1 className="mt-5">CreateAsset</h1>
            
                <div className="form-group w-25 mx-auto">
                    <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
                    {/* col-xs-3 */}
                    <div className="col-sm-10 w-10 mx-auto">
                    <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
                    </div>
                </div>

              
                <div className="form-group w-25 mx-auto">
                    <label htmlFor="color" className="col-form-label mx-auto">Color{formInputColor} </label>
                    <div className="col-sm-10 mx-auto">
                    <input type="text" className="form-control" onChange={e=>setFormInputColor(e.target.value)} id="color" placeholder="color"/>
                    </div>
                </div>
                <div className="form-group w-25 mx-auto">
                    <label htmlFor="color" className="col-form-label mx-auto">Weight  {formInputWeight}</label>
                    <div className="col-sm-10 mx-auto">
                    <input type="number" className="form-control" onChange={e=>setFormInputWeight(e.target.value)} id="weight" placeholder="weight"/>
                    </div>
                </div>


                <div className="form-group row d-block">
                    <div className="col-sm-12">
                        <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Create</button>
                        {/* onClickCapture also worked */}
                    </div>
                </div>
            

            <div>
                {postReply.ID ? (
                    <div className="mx-auto container-fluid p-5">
                        <div className="d-block p-5">
                            <h3>You created {postReply.ID} with the following details: </h3>
                        </div>      
                        <section>
                        
                                <PrintAssets ID={postReply.ID} color={postReply.color} weight={postReply.weight} owner={postReply.owner} creator={postReply.creator} expirationDate={postReply.expirationDate} />
                            
                        </section> 
                        <hr />
                        <div>
                            <p className="text-center d-block"><a href="/farmerFrontPage" className="btn btn-small btn-primary" >Go back</a></p>
                        </div>
                    
                    </div>
                    ) : postReply.errorCLI?(
                        <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink="farmerFrontPage" />
                    ):(
                        <Error message="Plese enter assetID to continue or go back"backlink="farmerFrontPage" />
                    )
                }
            </div>

        </div>
    );



}

export default ShowPost;








    // if(items.ID){
    //     return(
    //         <div className="mx-auto container-fluid p-5">
    //             <div className="d-block p-5">
    //                 <h3>successfully created {items.ID} </h3>
    //             </div>      
    //             <section>
                  
    //                     <PrintAssets ID={items.ID} color={items.color} weight={items.weight} owner={items.owner} creator={items.creator} expirationDate={items.expirationDate} />
                    
    //             </section> 
    //             <hr />
    //             <div>
    //                 <p className="text-center d-block"><a href="/farmerFrontPage" className="btn btn-small btn-primary" >Go back</a></p>
    //             </div>
               
    //         </div>
    //     );
    // }

    // return(
    //     <Error message="Something went wrong . The asset couldn't be created.Make sure ID of asset doesn't exist already." backlink="/farmerFrontPage" />
    // );