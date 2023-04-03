import * as React from "react";
import $ from "jquery";

function Carousel(props) {
  const id_name = "#" + props.type;

  function getActiveIndex(type){
    const id = $("#" + type + " .carousel-item.active").attr("id");
    console.log($("#" + type + " .carousel-item.active").attr("id"));
    return id.substring(1,2);
  }
  
  return (
    <div id={props.type} className="carousel slide">
      <div className="carousel-indicators">
        {props.data.map((file, index) => {
          if (index === 0)
            return (
              <button
                type="button"
                data-bs-target={id_name}
                data-bs-slide-to={index}
                className="active"
                key={index}
              ></button>
            );
          return (
            <button
              type="button"
              data-bs-target={id_name}
              data-bs-slide-to={index}
              key={index}
            ></button>
          );
        })}
      </div>
      <div
        className="carousel-inner"
        onClick={() => {
          props.fullViewToggle(props.type, getActiveIndex(props.type));
        }}
      >
        {props.data.map((file, index) => {
          if (index === 0) {
            return (
              <div
                className="carousel-item active"
                key={index}
                id={"m" + index}
              >
                {props.type === "image" ? (
                  <img
                    src={file}
                    className="d-block w-100"
                    alt="..."
                    id={"m" + index}
                  />
                ) : (
                  <video className="width-100" autoPlay loop muted id={"m" + index}>
                    <source
                      src={file}
                      type="video/mp4"
                      id={"m" + index}
                    ></source>
                  </video>
                )}
              </div>
            );
          }
          return (
            <div className="carousel-item" key={index} id={"m" + index}>
              {props.type === "image" ? (
                <img
                  src={file}
                  className="d-block w-100"
                  alt="..."
                  id={"m" + index}
                />
              ) : (
                <video className="width-100" autoPlay loop muted id={"m" + index}>
                  <source src={file} type="video/mp4" id={"m" + index}></source>
                </video>
              )}
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
