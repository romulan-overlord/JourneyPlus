import React, {useState, useEffect} from "react";

function Card(props){
    useEffect(function setHeight(){
        let windowHeight = 1080;
        let windowWidth = 1920;
        let cardHeight = $("#card").outerHeight();
        let cardWidth = $("#card").outerWidth();
        $("#card" + props.index).outerHeight((windowHeight/windowWidth) * cardWidth);
        console.log("Before resize: " + cardHeight);
        console.log($("#card").outerHeight());
    })

    return (
      <div className="card-container h-100 px-3 pb-2 col-lg-4 col-md-6">
        <div className="card h-100 border-success card-red">
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
