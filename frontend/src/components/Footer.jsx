import React, { useState, useEffect } from "react";
import $ from "jquery";

import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import WallpaperIcon from "@mui/icons-material/Wallpaper";

import backgrounds from "./settings";

export default function Footer(props) {
  const [isAudio, setAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [muteAudio, setMuteAudio] = useState(false);
  const [reRender, setRender] = useState(false);

  useEffect(() => {
    if (reRender) {
      setRender((prev) => {
        return !prev;
      });
    }
  });

  function getBackgroundAudio(event) {
    const file = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function () {
      setAudioSrc(reader.result);
      setAudio(true);
      props.addBkgAudio(reader.result);
    };
  }

  function muteBkg() {
    setMuteAudio((prev) => {
      return !prev;
    });
    setRender((prev) => {
      return !prev;
    });
  }

  function setBackground(index) {
    const i = index + 1;
    const imageUrl = "./../images/bkg" + i + ".jpg";
    $("body").css("background-image", "url(" + imageUrl + ")");
    $("#footer").css("background-color", "rgba(18,18,18,0.3)");
    $("#footer").css("border-top", "solid rgb(200,200,200) 1px");
    props.addBkgImage(i);
  }

  return (
    <div className="footer px-5" id="footer">
      <span className="date-p">13th February, 2023</span>
      <span className="date-p mx-2">|</span>
      <span className="date-p me-1">
        <CloudOutlinedIcon />
      </span>
      <span className="date-p">Cloudy</span>
      <span className="date-p mx-2">|</span>
      <span className="date-p">
        <label htmlFor="files">
          <AttachFileOutlinedIcon fontSize="small"></AttachFileOutlinedIcon>
        </label>
      </span>
      <span className="date-p mx-2">|</span>
      <span className="date-p">
        <input
          onChange={getBackgroundAudio}
          className="noDisplay"
          type="file"
          id="bkgAudio"
          name="bkgAudio"
          accept="audio/*"
        />
        {isAudio && !muteAudio ? (
          <audio className="noDisplay" autoPlay loop>
            <source src={audioSrc} type="audio/mpeg"></source>
          </audio>
        ) : null}
        <label htmlFor="bkgAudio">
          <MusicNoteIcon fontSize="small"></MusicNoteIcon>
        </label>
      </span>
      <span className="date-p mx-2">|</span>
      <span className="date-p" onClick={muteBkg}>
        {muteAudio ? (
          <VolumeOffIcon fontSize="small"></VolumeOffIcon>
        ) : (
          <VolumeUpIcon fontSize="small"></VolumeUpIcon>
        )}
      </span>
      <span className="date-p mx-2">|</span>
      <div className="dropdown my-dropdown">
        <a
          className="btn btn-sm dropdown-toggle bkg-btn"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <WallpaperIcon className="date-p" fontSize="small"></WallpaperIcon>
        </a>
        <ul className="dropdown-menu my-dropdown-menu">
          {backgrounds.map((background, index) => {
            return (
              <li
                onClick={() => {
                  setBackground(index);
                }}
              >
                <img
                  className="dropdown-item"
                  src={"./../images/" + background + ".jpg"}
                ></img>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="date-p return-button">Return</p>
    </div>
  );
}
