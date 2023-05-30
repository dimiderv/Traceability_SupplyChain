
function PrintBuyRequest(props) {

    
    return(
        <div className="container-fluid p-3 w-50">
        <div className="card-deck">
            <div className="card">
                <div className="card-body p-1">
                    <h6 className="card-title">Asset to buy: {props.assetID}</h6>
                    <p className="card-text">Buyer is: {props.buyerID}</p>
                    <p className="card-text">Buyer MSP is: {props.buyerMSP}</p>
                    <p className="card-text">Timestamp: {props.timestamp}</p>
                    <p className="card-text">TxId: {props.txId}</p>
                    <p className="card-text">Salt: {props.salt}</p>
                </div>
            </div>
        </div>
    </div>

    );


}

export default PrintBuyRequest;