import corn from "../images/corn.png";
import fruits from "../images/fruits.jpg";

import Slider from "./frontpage/Slider";
import CardContainers from "./frontpage/CardContainers";

import { superMarketCardContainerdetails } from "./data/data";

function SupermarketFrontPage() {
  return (
    <section className="mainPage">
      {/* <!-- Slider --> */}
      <Slider img1={fruits} img2={corn} />

      {/* <!-- Content --> */}
      {superMarketCardContainerdetails.map((data) => (
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

export default SupermarketFrontPage;
