export default function Cards({ cardTitle, cardText, buttonText, linkRef }) {
  return (
    <div key={cardTitle} className="card ">
      <img className="card-img-top" src="" alt="" />
      <div className="card-body">
        <h6 className="card-title">{cardTitle}</h6>
        <p className="card-text ">{cardText}</p>
      </div>
      <p className="text-center">
        <a href={linkRef} className="btn btn-small btn-primary">
          {buttonText}
        </a>
      </p>
    </div>
  );
}
