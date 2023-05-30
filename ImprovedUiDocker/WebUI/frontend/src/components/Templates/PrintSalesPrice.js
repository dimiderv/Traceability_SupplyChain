function PrintSalesPrice(props) {

    
    return(
        <div className="container-fluid p-3 w-50">
            <div className="card-deck">
                <div className="card">
                    <div className="card-body p-1">
                        <h6 className="card-title">{props.ID}</h6>
                        <p className="card-text">Price : $ {props.price}</p>
                        <p className="card-text"><i>Trade ID: {props.tradeID}</i></p>
                        <p className="card-text"><i>Salt: {props.salt}</i></p>
                    </div>
                </div>
            </div>
        </div>

    );


}

export default PrintSalesPrice;