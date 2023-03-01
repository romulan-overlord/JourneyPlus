import React, {useState, useEffect} from "react";

function Card(props){

    useEffect( () => {
      const id = "#c" + props.index;
      const imageID = props.entry.backgroundImage;
      if(imageID === undefined)
        $(id).css("background-color", "#908C3C");
      const imageUrl = "./../images/bkg" + imageID + ".jpg";
      $(id).css("background-image", "url(" + imageUrl + ")");
    })

    return (
      <div className="card-container px-3 pb-2 col-lg-4 col-md-6">
        <div className="card h-100 border-success card-red" id={"c" + props.index}>
          <div className="card-body">
            <h3 className="main-page-card-title">{props.entry.title}</h3>
            <p className="main-page-card-text">
              {props.entry.content}
            </p>
            {/* <div className="text-center">
                  <button
                    className="btn btn-lg btn-block btn-outline-dark align-card-button"
                    type="button"
                  >
                    Read More...
                  </button>
                </div> */}
          </div>
        </div>
      </div>
    );
}

export default Card;
