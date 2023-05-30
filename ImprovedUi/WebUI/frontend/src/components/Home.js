import React from 'react';
import farmerImage from '../images/farmers.jpg';
import retailerImage from '../images/retailers.jpg';
import supermarketImage from '../images/supermarket.jpg';
import slide from "../images/slide-mountains.jpg"

import FrontPageCards from './frontpage/FrontPageCards';
function Home() {
    return(
        <section>
            <div className="carousel" id="mainSlide">
                <div className="carousel-inner">
                <img className="w-100 d-block"src={slide} alt=""/>
                </div>
            </div>
            <div className="container-fluid">
                <h1 className="mt-5">This is my Project On Hyperledger</h1>
                <p>This site was created using Node JS and React.</p>
            </div>
            <div className="container-fluid p-5">
                {/* <h1 className="bg-light p-5" id="projectAnchor">Here are the users</h1> */}
            
                {/* <!-- cards --> */}
                
                <div className="card-deck">
                        <FrontPageCards src={farmerImage} cardTitle={'Farmer'} cardText={'Use the app as a farmer'} refLink={'/farmerFrontPage'} />
                        <FrontPageCards src={retailerImage} cardTitle={'Retailer'} cardText={'Use the app as a retailer'} refLink={'/retailerFrontPage'} />
                        <FrontPageCards src={supermarketImage} cardTitle={'Super Market'} cardText={'Use the app as a super market employee'} refLink={'/supermarketFrontPage'} />

                </div> 
            </div>
        </section>
    );
}

export default Home;