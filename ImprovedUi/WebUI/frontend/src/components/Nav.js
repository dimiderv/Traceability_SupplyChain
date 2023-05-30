import React from 'react'; // ES6 js
import {Link} from 'react-router-dom';

function Nav() {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="navMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navMainMenu" className="navbar-collapse collapse">
                <div className="navbar-nav ml-auto">
                    <Link to='/' className="nav-item nav-link active">Home</Link>
                    <Link to='/farmerFrontPage' className="nav-item nav-link ">Farmer</Link>
                    <Link to='/retailerFrontPage' className="nav-item nav-link ">Retailer</Link>
                    <Link to='/supermarketFrontPage' className="nav-item nav-link ">Supermarket</Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
