import React, {useState} from 'react';

function PrintAssets(props) {
    const [visible, setVisible] = useState(false);
    

    return(
    <div className="card p-1 m-2  " style={{width:23+"em"}}>
        <div className="col-sm">
            <div className="card-body ">
                <h4 className="card-header mb-2"> {props.ID} </h4>
                <p className="card-text"> Asset Type : {props.assetType} </p>
                <p className="card-text"> Weight (Kg) : {props.weight} </p>
                <p className="card-text"> Owner : {props.owner} </p>
                <p className="card-text"> Owner Org : {props.ownerOrg} </p>
                <p className="card-text"> Creator : {props.creator} </p>
                <p className="card-text"> Creation Timestamp : {props.creationTimestamp} </p>
                <p className="card-text"> Expiration : {props.expirationDate} </p>
                <p className="card-text"> Sensor Data : {props.sensorData} </p>
                {visible && <p className="card-text"> {props.daysLeft} </p>}
                
                <button className="btn btn-primary" onClick={()=> setVisible(!visible)} > Expiration Info </button>
            </div>
        </div>
    </div>
    )


}

export default PrintAssets;