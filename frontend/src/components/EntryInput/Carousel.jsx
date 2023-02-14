import * as React from "react";

function Carousel(props) {
  return (
    <div id="carousel" class="carousel slide">
      <div class="carousel-indicators">
        {props.media.map((file, index) => {
          return (
            <button
              type="button"
              data-bs-target="#carousel"
              data-bs-slide-to={index}
              class="active"
            ></button>
          );
        })}
      </div>
      <div class="carousel-inner">
        {props.media.map((file, index) => {
          if (index === 0) {
            return (
              <div class="carousel-item active">
                <img src={file} class="d-block w-100" alt="..." />
              </div>
            );
          }
          return (
            <div class="carousel-item">
              <img src={file} class="d-block w-100" alt="..." />
            </div>
          );
        })}
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;
