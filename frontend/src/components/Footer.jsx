import React, { useState, useEffect } from "react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

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
          <VolumeOffIcon></VolumeOffIcon>
        ) : (
          <VolumeUpIcon></VolumeUpIcon>
        )}
      </span>
    </div>
  );
}
