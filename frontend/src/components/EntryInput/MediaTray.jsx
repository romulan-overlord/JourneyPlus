import React from "react";
import $ from "jquery";
import Carousel from "./Carousel";

function MediaTray(props){
  const compartments = Object.keys(props.mediaData);
  const compartmentData = Object.values(props.mediaData);

  function getHeight(){
    let windowHeight = window.innerHeight;
    let headerHeight = $("#header").outerHeight();
    let footerHeight = $("#footer").outerHeight();
    const mediaHeight = $("#media-div").outerHeight(windowHeight - headerHeight - footerHeight);
    return mediaHeight;
  }

  return(
    <div className="container-fluid px-3 media-tray-container" id="media-div" height={getHeight()}>
      {compartments.map( (fileType, index) => {
        return <Carousel type={fileType} data={compartmentData[index]} />
      })}
    </div>
  )
}

export default MediaTray;