function PrintHistory(props) {

    
    return(
       
        <div className="card p-1 m-2  " style={{width:23+"em"}}>
            <div className="col-sm">
                <div className="card-body ">
                    <h6 className="card-header">{props.ID}</h6>
                    <p className="card-text"> Asset Type : {props.assetType} </p>
                    {/* <p className="card-text">Color {props.color}</p> */}
                    <p className="card-text"><i>Weight (Kg): {props.weight}</i></p>
                    <p className="card-text"><i>Owner:  {props.owner}</i></p>
                    <p className="card-text"> Owner Org : {props.ownerOrg} </p>
                    <p className="card-text"><i>Creator: {props.creator}</i></p>
                    <p className="card-text"><i>SensorData: {props.sensorData}</i></p>
                    <p className="card-text"><i>Creation Timestamp: {props.creationTimestamp}</i></p>
                    <p className="card-text"><i>Expires: {props.expirationDate}</i></p>
                    <hr />
                    <p className="card-text"><i>Transaction Id: {props.txId}</i></p>
                    <p className="card-text"><i>Transaction Timestamp: {props.timestamp}</i></p>
                </div>
            </div>
        </div>
      

    );
    // <div className="card p-1 m-2  " style={{width:23+"em"}}>
    //     <div className="col-sm">
    //         <div className="card-body ">
    //             <h4 className="card-header "> {props.ID} </h4>
    //             <p className="card-text "> Color : {props.color}. </p>
    //             <p className="card-text"> Weight (Kg) : {props.weight}. </p>
    //             <p className="card-text"> Owner : {props.owner}. </p>
    //             <p className="card-text "> Creator : {props.creator}. </p>
    //             <p className="card-text"> Exiration : {props.expirationDate}. </p>
    //             <button className="btn btn-primary"> View </button>
    //         </div>
    //     </div>
    // </div>

}

export default PrintHistory;