import React, { useState, useEffect } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";

function Card(props) {
  console.log(props.entry.media.video.length === 0);

  const [checkFlags, setCheck] = useState(true);
  const [flags, setFlags] = useState({
    isMedia: false,
    isBkgAud: false,
  });

  function checkMedia() {
    let tempBool = true;
  // console.log(props.entry.media.image.length);
  const isMedia = () => {
    if (
      props.entry.media.image.length === 0 &&
      props.entry.media.video.length === 0 &&
      props.entry.media.audio.length === 0
    )
      tempBool = false;
    else tempBool = true;
    setFlags((prev) => {
      return {
        ...prev,
        isMedia: tempBool,
      };
    });

    if (props.entry.backgroundAudio === "" || props.entry.backgroundAudio === undefined)
      tempBool = false;
    tempBool =  true;
    setFlags((prev) => {
      return {
        ...prev,
        isBkgAud: tempBool,
      };
    });
  }

  useEffect(() => {
    const id = "#c" + props.index;
    const defaultImg = "./../images/img2.jpg";
    const imageID = props.entry.backgroundImage;
    // console.log(imageID);
    if (imageID === undefined || imageID === "")
      $(id).css("background-image", "url(" + defaultImg + ")");
    else {
      const imageUrl = "./../images/bkg" + imageID + ".jpg";
      $(id).css("background-image", "url(" + imageUrl + ")");
    }
    if(checkFlags === true){
      checkMedia();
      setCheck(false)
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
            {flags.isMedia ? (
              <span className="date-p">
                <PermMediaIcon fontSize="small"></PermMediaIcon>
              </span>
            ) : null}
            {flags.isBkgAud ? (
              <span className="date-p">
                <AudiotrackIcon fontSize="small"></AudiotrackIcon>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
