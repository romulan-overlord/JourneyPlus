import React, { useState, useEffect } from "react";
import $ from "jquery";

import Carousel from "./Carousel";
import List from "./List";
import FullView from "../FullView";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

var _ = require("lodash");

function MediaTray(props) {
  const [delSwitcher, setDelSwitcher] = useState(true);
  const compartments = Object.keys(props.mediaData);
  const compartmentData = Object.values(props.mediaData);
  const [isFullView, setFullView] = useState(false);
  const [fullViewMarker, setFullViewMarker] = useState({});

  useEffect(() => {
    if (!props.ready) {
      props.changeReady();
    }
  });

  function fullViewToggle(type, index) {
    setFullView((prev) => !prev);
    console.log("type: " + type);
    console.log("index: " + index);
    setFullViewMarker({
      type: type,
      index: index,
    });
  }

  function deleteMedia(carouselType) {
    props.changeReady();
    const typeID = "#" + carouselType;
    let temp = "";
    console.log(typeID + " .active");
    if (carouselType === "image") {
      temp = $(typeID + " .active img").attr("id");
      console.log("message from the stars: " + temp);
    } else if (carouselType === "video") {
      temp = $(typeID + " .active source").attr("id");
    }
    props.removeMedia(carouselType, temp.slice(1));
  }

  function deleteAudio(carouselType, index) {
    const typeID = "#" + index;
    let temp = "";
    if (carouselType === "audio") {
      temp = $(typeID + " .audio-player").attr("id");
    }
    console.log("audio index: " + index + " " + carouselType);
    props.removeMedia(carouselType, index);
  }

  return (
    <div className="container-fluid px-3 media-tray-container" id="media-div">
      {isFullView ? (
        <FullView
          compartments={compartments}
          compartmentData={compartmentData}
          marker = {fullViewMarker}
          close = {() => {setFullView((prev) => !prev);}}
        ></FullView>
      ) : null}
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
                createMode={props.createMode}
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
              {props.createMode ? (<div className="col-1">
                <IconButton
                  className="mx-auto"
                  onClick={() => {
                    deleteMedia(fileType);
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "white" }} />
                </IconButton>
              </div>) : null}
            </div>
            {props.ready ? (
              <Carousel
                type={fileType}
                data={compartmentData[index]}
                key={index}
                fullViewToggle={fullViewToggle}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default MediaTray;
