import React, {useState, useEffect} from "react";

function Card(){
    useEffect(function setHeight(){
        let windowHeight = 1080;
        let windowWidth = 1920;
        let cardHeight = $("#card").outerHeight();
        let cardWidth = $("#card").outerWidth();
        $("#card").outerHeight((windowHeight/windowWidth) * cardWidth);
        console.log("Before resize: " + cardHeight);
        console.log($("#card").outerHeight());
    })

    return (
      <div className="card-padding col-lg-4 col-md-6">
        <div id="card" className="card border-success mb-3 card-red">
          {/* <div className="card-header">
                <h3>Header</h3>
              </div> */}
          <div className="card-body">
            <h3 className="main-page-card-title">Success card title</h3>
            <p className="main-page-card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
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
