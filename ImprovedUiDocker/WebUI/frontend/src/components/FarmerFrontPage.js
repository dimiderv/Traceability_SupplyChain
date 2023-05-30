import img1 from "../images/farming1.jpg";
import img2 from "../images/fruits.jpg";

import CardContainers from "./frontpage/CardContainers";
import Slider from "./frontpage/Slider";

import { farmerCardContainerdetails } from "./data/data";


function FarmerFrontPage() {
  return (
    <section className="mainPage">
      {/* <!-- Slider --> */}

      <Slider img1={img1} img2={img2} />
      {/* <!-- Content --> */}
      {farmerCardContainerdetails.map((data) => (
        <CardContainers
          key={data.titleText}
          cardsClass={data.cardsClass}
          titleText={data.titleText}
          containerClass={data.containerClass}
          cardsDetails={data.cardsDetails}
        />
      ))}
    </section>
  );
}

export default FarmerFrontPage;
