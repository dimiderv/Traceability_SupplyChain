export default function Slider({ img1, img2 }) {
  return (
    <div className="carousel slide" id="mainSlide">
      <div className="carousel-inner mx-auto text-center">
        <div className="carousel-item active ">
          <img className="mw-100  mx-auto mh-50 d-block" src={img1} alt="" />
        </div>

        <div className="carousel-item">
          <img className="mw-150 mx-auto mh-150 d-block" src={img2} alt="" />
        </div>
        <a
          className="carousel-control-prev"
          href="#mainSlide"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#mainSlide"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
}
