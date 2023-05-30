import React, {useEffect, useState} from 'react';
// import {Link} from 'react-router-dom';
import Error from '../Templates/Error';
import PrintAssets from '../Templates/PrintAssets';


function UpdateSensorData(props) {
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
    const [formInputSensor,setFormInputSensor]=useState('');
    const [postReply, setPostReply] = useState([]);

    useEffect( () => {     
        
 
        fetchPostReply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPostReply ()  {


        const formData={
            assetID:formInputID,
            sensorData:formInputSensor,
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
        if(formData.assetID !=="" && formData.sensorData!==""){
            const response = await fetch('/postUpdateSensorData',options);
            const json = await response.json();
            setPostReply(json); 
            console.log(json);
        }
 
        

    };




    return(
    <div className="container justify-content-center p-5 ">
        <h1 className="mt-5">Update Sensor Data</h1>
    
        <div className="form-group w-25 mx-auto">
            <label htmlFor="assetID" className="col-form-label mx-auto">Asset ID {formInputID}</label>
            {/* col-xs-3 */}
            <div className="col-sm-10 w-10 mx-auto">
            <input type="text" className="form-control " required onChange={e=>setFormInputID(e.target.value)} id="assetID" placeholder="asset#"/>
            </div>
        </div>

      
        <div className="form-group w-25 mx-auto">
            <label htmlFor="sensorData" className="col-form-label mx-auto">Sensor Data {formInputSensor} </label>
            <div className="col-sm-10 mx-auto">
            <input type="text" className="form-control" onChange={e=>setFormInputSensor(e.target.value)} id="sensorData" placeholder="Sensor Data"/>
            </div>
        </div>


        <div className="form-group row d-block">
            <div className="col-sm-12">
                <button type="submit" value="Send" onClick={fetchPostReply} className="btn btn-primary">UpdateSensorData</button>
                {/* onClickCapture also worked */}
            </div>
        </div>
    

        <div>
            {postReply.expirationTime ? (
                <div className="mx-auto container-fluid p-5">
                    <div className="d-block p-5">
                        <h3>You Updated {postReply.ID} sensor data with the following details: </h3>
                    </div>      
                    <div className="d-flex align-items-center 
                  justify-content-center flex-wrap p-2 m-2 ">
                    
                            <PrintAssets ID={postReply.asset_obj.ID}  weight={postReply.asset_obj.weight} owner={postReply.asset_obj.owner} creator={postReply.asset_obj.creator} expirationDate={postReply.asset_obj.expirationDate} sensorData={postReply.asset_obj.sensorData} assetType={postReply.asset_obj.assetType} ownerOrg={postReply.asset_obj.ownerOrg} daysLeft={postReply.expirationTime} creationTimestamp={postReply.asset_obj.timestamp}/>
                        
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

export default UpdateSensorData;



