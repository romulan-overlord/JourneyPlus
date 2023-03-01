import React, {useState, useEffect} from "react";

function Card(props){

    useEffect( () => {
      const id = "#c" + props.index;
      const defaultImg = "./../images/img2.jpg";
      const imageID = props.entry.backgroundImage;
      console.log(imageID);
      if(imageID === undefined || imageID === "")
        $(id).css("background-image", "url(" + defaultImg + ")");
      else{
        const imageUrl = "./../images/bkg" + imageID + ".jpg";
        $(id).css("background-image", "url(" + imageUrl + ")");
      }
    })

    return (
      <div className="card-container px-3 pb-2 col-lg-4 col-md-6">
        <div className="card h-100 border-success card-red" id={"c" + props.index}>
          <div className="card-body">
            <h3 className="main-page-card-title">{props.entry.title}</h3>
            <p className="main-page-card-text">
              {props.entry.content.substring(0,200) + "..."}
            </p>
          </div>
        </div>
      </div>
    );
}

export default Card;
