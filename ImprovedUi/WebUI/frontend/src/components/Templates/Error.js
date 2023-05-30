function Error(props) {

    let backLink=props.backlink;
    let message=props.message;
    return(
        <div>
            <div className="mx-auto container-fluid p-5">
                <div className="d-block p-5">
                    <h3>{message} </h3>
                </div>      
                <section>
                    <hr />
                </section> 
                <footer>
                    <p className="text-center d-block"><a href={backLink} className="btn btn-small btn-primary" >Go back</a></p>
                </footer>
            
            </div>
        </div>

    );


}

export default Error;