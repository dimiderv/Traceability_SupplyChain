import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function UpdateAsset(props) {
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
    const [formInputWeight,setFormInputWeight]=useState('');
    const [formInputColor,setFormInputColor]=useState('');
    const [postReply, setPostReply] = useState([]);

    useEffect( () => {     
        
 
        fetchPostReply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPostReply ()  {


        const formData={
            assetID:formInputID,
            weight:formInputWeight,
            color:formInputColor,
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
        if(formData.assetID !=="" && formData.weight!=="" && formData.color!==""){
            const response = await fetch('/postUpdateAsset',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };




    return(
    <div className="container justify-content-center p-5 ">
        <h1 className="mt-5">Update Asset</h1>
    
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
                <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">Update</button>
                {/* onClickCapture also worked */}
            </div>
        </div>
    

        <div>
            {postReply.ID ? (
                <div className="mx-auto container-fluid p-5">
                    <div className="d-block p-5">
                        <h3>You Updated {postReply.ID} with the following details: </h3>
                    </div>      
                    <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                    
                            <PrintAssets ID={postReply.ID} color={postReply.color} weight={postReply.weight} owner={postReply.owner} creator={postReply.creator} expirationDate={postReply.expirationDate} sensorData={postReply.sensorData} assetType={postReply.assetType} ownerOrg={postReply.ownerOrg}/>
                        
                    </div> 
                    <hr />
                    <div>
                        <p className="text-center d-block"><a href={back} className="btn btn-small btn-primary" >Go back</a></p>
                    </div>
                
                </div>
                ) : postReply.errorCLI ? ( 
                    <Error message={" Error with status "+postReply.errorStatus+". "+postReply.errorMessage[0].toUpperCase()+postReply.errorMessage.slice(1)+"."}backlink={back}/>
                ):(
                    <Error message="Plese enter assetID for deletion or go back" backlink={back} />
                )
            }
        </div>

    </div>
);




}

export default UpdateAsset;

/*Previous fetch function*/
// let back;//link to go back to home page 
// if(props.org==="org1"){
//    back="/farmerFrontPage"; //assigning values like this doesnt work
// }else if (props.org==="org2"){
//     back="/retailerFrontPage";
// }else{
//     back="/supermarketFrontPage";
// }
// const [items, setItems] = useState([]);

// useEffect( () => {

//     const fetchItems = async () => {
//         const orgLink="/";
//         let temp;
        
//         if(props.org==="org1"){
//         temp="farmerFrontPage/updateAsset";
//         //back="/farmerFrontPage"; //assigning values like this doesnt work
//         }else if (props.org==="org2"){
//             temp="retailerFrontPage/updateAsset";
//             // back="/retailerFrontPage";
//         }else{
//             temp="supermarketFrontPage/updateAsset";
//         // back="/supermarketFrontPage";
//         }
        
//         const data = await fetch(orgLink+temp);
//         const items = await data.json();
//         setItems(items);
//     };



//     fetchItems();
// }, [props.org]);

