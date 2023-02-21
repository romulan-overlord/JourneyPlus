import React from "react";
import $ from "jquery";

import Carousel from "./Carousel";
import List from "./List";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

var _ = require("lodash");

function MediaTray(props) {
  const compartments = Object.keys(props.mediaData);
  const compartmentData = Object.values(props.mediaData);

  function deleteMedia(carouselType) {
    const typeID = "#" + carouselType;
    let temp = "";
    if (carouselType === "image") {
      temp = $(typeID + " .active img").attr("src");
    } else if (carouselType === "video") {
      temp = $(typeID + " .active source").attr("src");
    }
    props.removeMedia(carouselType, temp);
  }

  function deleteAudio(carouselType, index) {
    const typeID = "#" + index;
    let temp = "";
    if (carouselType === "audio") {
      temp = $(typeID + " .audio-player  source").attr("src");
    }
    props.removeMedia(carouselType, temp);
  }

  return (
    <div className="container-fluid px-3 media-tray-container" id="media-div">
      {compartments.map((fileType, index) => {
        if (compartmentData[index].length === 0) return null;
        if (fileType === "audio") {
          return (
            <div key={index}>
              <p className="lead">{_.capitalize(fileType)}s</p>
              <List
                type={fileType}
                data={compartmentData[index]}
                key={index}
                deleteMedia={deleteAudio}
              />
            </div>
          );
        }
        return (
          <div key={index}>
            <div className="row">
              <div className="col-10">
                <span className="lead">{_.capitalize(fileType)}s</span>
              </div>
              <div className="col-1">
                <IconButton
                  className="mx-auto"
                  onClick={() => {
                    deleteMedia(fileType);
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "white" }} />
                </IconButton>
              </div>
            </div>
            <Carousel
              type={fileType}
              data={compartmentData[index]}
              key={index}
            />
          </div>
        );
      })}
    </div>
  );
}

export default MediaTray;
