import Cards from "./Cards";

export default function CardContainers({
  titleText,
  containerClass,
  cardsClass,
  cardsDetails,
}) {
  return (
    <div className={"container-fluid p-5 " + containerClass}>
      <h1 className=" p-5" id="projectAnchor">
        {titleText}{" "}
      </h1>

      {/* <!-- cards --> */}
      <div className={"card-deck " + cardsClass}>
        {cardsDetails.map((data) => (
          <Cards
            key={data.cardText}
            cardText={data.cardText}
            cardTitle={data.cardTitle}
            buttonText={data.buttonText}
            linkRef={data.linkRef}
          />
        ))}
      </div>
    </div>
  );
}
