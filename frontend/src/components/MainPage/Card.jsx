import React, { useState, useEffect } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";

function Card(props) {

  console.log(props.entry.media.image.length);
  const isMedia = () => {
    if (
      props.entry.media.image.length === 0 &&
      props.entry.media.video.length === 0 &&
      props.entry.media.audio.length === 0
    )
      return false;
    return true;
  };

  const isBkgAud = () => {
    if(entry.backgroundAudio === "" || entry.backgroundAudio === undefined)
      return false;
    return true;
  }
  useEffect(() => {
    const id = "#c" + props.index;
    const defaultImg = "./../images/img2.jpg";
    const imageID = props.entry.backgroundImage;
    console.log(imageID);
    if (imageID === undefined || imageID === "")
      $(id).css("background-image", "url(" + defaultImg + ")");
    else {
      const imageUrl = "./../images/bkg" + imageID + ".jpg";
      $(id).css("background-image", "url(" + imageUrl + ")");
    }
  });

  return (
    <div
      className="card-container px-3 pb-2 col-lg-4 col-md-6"
      key={props.index}
      onClick={() =>{
        props.openEntry(props.entry, false);
      }}
    >
      <div
        className="card h-100 card-red"
        id={"c" + props.index}
        key={props.index}
      >
        <div className="card-body" key={props.index}>
          <h3 className="main-page-card-title">{props.entry.title}</h3>
          <p className="main-page-card-text">
            {props.entry.content.substring(0, 200) + "..."}
          </p>
        </div>
        <div className="row w-100 bottom-menu">
          <div className="col-12 bottom-menu-col">
            {isMedia ? (
              <span className="date-p">
                <PermMediaIcon fontSize="small"></PermMediaIcon>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
