
export default function FrontPageCards({src, cardTitle, cardText, refLink}){

    return(
        <div className="card">
            <img className="card-img-top" src={src} alt="" />
            <div className="card-body">
                <h6 className="card-title">{cardTitle}</h6>
                <p className="card-text ">{cardText}</p>
                <p className="text-center"><a href={refLink} className="btn btn-small btn-primary" >Log In</a></p>
            </div>
        </div>
    )

}