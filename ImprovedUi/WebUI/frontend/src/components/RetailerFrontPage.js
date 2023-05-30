import corn from "../images/corn.png";
import fruits from "../images/fruits.jpg";

import Slider from "./frontpage/Slider";
import CardContainers from "./frontpage/CardContainers";

import { retailerCardContainerdetails } from "./data/data";


function RetailerFrontPage() {
  return (
    <section className="mainPage">
      {/* <!-- Slider --> */}

      <Slider img1={corn} img2={fruits} />

      {/* <!-- Content --> */}
      {retailerCardContainerdetails.map((data) => (
        <CardContainers
          key={data.titleText}
          titleText={data.titleText}
          containerClass={data.containerClass}
          cardsClass={data.cardsClass}
          cardsDetails={data.cardsDetails}
        />
      ))}
    </section>
  );
}

export default RetailerFrontPage;
