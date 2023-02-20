import React from "react";
import Carousel from "./Carousel";
import List from "./List";

var _ = require("lodash");

function MediaTray(props) {
  const compartments = Object.keys(props.mediaData);
  const compartmentData = Object.values(props.mediaData);

  return (
    <div className="container-fluid px-3 media-tray-container" id="media-div">
      {compartments.map((fileType, index) => {
        if(fileType === "audio"){
          return(
            <div>
            <p className="lead">{_.capitalize(fileType)}s</p>
            <List type={fileType} data={compartmentData[index]} />
          </div>
          )
        }
        return (
          <div>
            <p className="lead">{_.capitalize(fileType)}s</p>
            <Carousel type={fileType} data={compartmentData[index]} />
          </div>
        );
      })}
    </div>
  );
}

export default MediaTray;
