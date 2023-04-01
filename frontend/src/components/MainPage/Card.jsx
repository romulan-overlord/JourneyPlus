import React, { useState, useEffect } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Card(props) {
  // console.log(props.entry.media.video.length === 0);

  // const pr1 = props.entry.private;
  // const pr2 = props.private;
  // if (props.entry.private !== props.private) return null;

  const [checkFlags, setCheck] = useState(true);
  const [flags, setFlags] = useState({
    isMedia: false,
    isBkgAud: false,
  });

  // const [showCard, setShowCard] = useState(true);

  // function checkMedia() {
  //   let tempBool = true;
  //   // console.log(props.entry.media.image.length);
  //   const isMedia = () => {
  //     if (
  //       props.entry.media.image.length === 0 &&
  //       props.entry.media.video.length === 0 &&
  //       props.entry.media.audio.length === 0
  //     )
  //       tempBool = false;
  //     else tempBool = true;
  //     setFlags((prev) => {
  //       return {
  //         ...prev,
  //         isMedia: tempBool,
  //       };
  //     });

  //     if (
  //       props.entry.backgroundAudio === "" ||
  //       props.entry.backgroundAudio === undefined
  //     )
  //       tempBool = false;
  //     tempBool = true;
  //     setFlags((prev) => {
  //       return {
  //         ...prev,
  //         isBkgAud: tempBool,
  //       };
  //     });
  //   };
  // }

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
    if (checkFlags === true) {
      // console.log("in check");
      // checkMedia();
      setCheck(false);
    }
  });

  return (
    <>
      {/* {props.entry.private === props.private ? ( */}
      <div
        className={
          props.inFeedPost
            ? "card-container col-12"
            : "card-container px-3 pb-2 col-lg-4 col-md-6"
        }
        key={props.index}
      >
        <div
          className={
            props.isFeed ? "card my-card h-100" : "card my-card h-100 card-red"
          }
          id={"c" + props.index}
          key={props.index}
        >
          <div className="card-menu">
            {!props.isFeed ? (
              <div className="dropdown card-dropdown">
                <a
                  className="btn btn-sm  bkg-btn"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <MoreVertIcon
                    className="date-p"
                    fontSize="small"
                  ></MoreVertIcon>
                </a>
                <ul className="dropdown-menu px-2">
                  <li
                    className="card-menu-item"
                    onClick={() => {
                      props.openEntry(props.entry, false, props.shared ? true : false);
                    }}
                  >
                    View
                  </li>
                  <li
                    className="card-menu-item"
                    onClick={() => {
                      props.openEntry(props.entry, true, props.shared ? true : false);
                    }}
                  >
                    Edit
                  </li>
                  <li
                    className="card-menu-item"
                    onClick={() => {
                      props.deleteEntry(props.entry.entryID);
                    }}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
          <div
            className="card-body"
            key={props.index}
            onClick={() => {
              props.openEntry(props.entry, false, props.shared ? true : false);
            }}
          >
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
      {/* ) : null} */}
    </>
  );
}

export default Card;
