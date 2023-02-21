import * as React from "react";

function Carousel(props) {
  const id_name = "#" + props.type;
  return (
    <div id={props.type} className="carousel slide">
      <div className="carousel-indicators">
        {props.data.map((file, index) => {
          return (
            <button
              type="button"
              data-bs-target={id_name}
              data-bs-slide-to={index}
              className="active"
            ></button>
          );
        })}
      </div>
      <div className="carousel-inner">
        {props.data.map((file, index) => {
          if (index === 0) {
            return (
              <div className="carousel-item active">
                {props.type === "image" ? (
                  <img src={file} className="d-block w-100" alt="..." />
                ) :  props.type === "video" ? (
                  <video className="width-100" autoPlay loop muted>
                    <source src={file} type="video/mp4"></source>
                  </video>
                ) : <audio controls>
                    <source src={file} type="audio/mpeg"></source>
                    <source src="horse.ogg" type="audio/ogg"></source>
                  </audio>}
              </div>
            );
          }
          return (
            <div className="carousel-item">
              {props.type === "image" ? (
                <img src={file} className="d-block w-100" alt="..." />
              ) : props.type === "video" ? (
                <video className="width-100" autoPlay loop muted>
                  <source src={file} type="video/mp4"></source>
                </video>
              ) : <audio controls>
                  <source src={file} type="audio/mpeg"></source>
                  <source src="horse.ogg" type="audio/ogg"></source>
                </audio>}
            </div>
          );
        })}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={id_name}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={id_name}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
