import React, { useState, useEffect } from "react";
import { expressIP, loadControl } from "../../settings";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import $ from "jquery";
import MediaTray from "./MediaTray";
import Footer from "../Footer";
import Shared from "./Shared";

function EntryInput(props) {
  // console.log(props.passedEntry);
  const [entryData, setEntryData] = useState(props.passedEntry);
  const [isMedia, setMedia] = useState(!props.createMode); //tracks if entry has media attachments (conditional rendering of MediaTray)
  const [ready, setReady] = useState(true); //tracks whether mediaTray is ready to be rendered or not
  const [isPrivate, setPrivate] = useState(entryData.private);
  const [editable, setEditable] = useState(() => {
    console.log("owner: " + entryData.owner);
    console.log(entryData.owner.length <= 0);
    if (entryData.owner === props.currentUser.username) return true;
    if (entryData.shared.includes(props.currentUser.username)) return true;
    if (entryData.owner.length <= 0) return true;
    return false;
  });

  useEffect(setDimensions);
  useEffect(() => {
    if (!props.createMode) fetchFullEntry();
  }, []);

  useEffect(() => {
    const handleTabClose = (event) => {
      event.preventDefault();
      return (event.returnValue = "Are you sure you want to exit?");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  if (!props.createMode) {
    $("input").prop("disabled", true);
    $("textarea").prop("disabled", true);
  }

  async function fetchFullEntry() {
    setEntryData(await props.fetchFullEntry(props.passedEntry));
    for (let i = 0; i < entryData.media.video.length; i++) {
      // console.log($("video#m" + i));
      $("video#m" + i)[0].load();
    }
    for (let i = 0; i < entryData.media.audio.length; i++) {
      // console.log($("video#m" + i));
      $("audio#m" + i)[0].load();
    }
    $("#backgroundPlayer")[0].load();
  }

  function changeReady() {
    setReady((prev) => {
      return !prev;
    });
  }

  function setEnv(date, weather) {
    setEntryData((prev) => {
      return {
        ...prev,
        date: date,
        weather: weather,
      };
    });
  }

  function handleTextChange(event) {
    const newData = event.target.value;
    const varName = event.target.name;
    setEntryData((prev) => {
      return {
        ...prev,
        [varName]: newData,
      };
    });
  }

  function addBkgAudio(src) {
    const temp = src;
    setEntryData((prev) => {
      return {
        ...prev,
        backgroundAudio: temp,
      };
    });
  }

  function addBkgImage(index) {
    setEntryData((prev) => {
      return {
        ...prev,
        backgroundImage: index,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadControl.setMouseLoading();
    entryData.lastModifiedBy = props.currentUser.username;
    entryData.lastModified = Date.now();
    fetch(expressIP + "/submit-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: props.currentUser.username,
        entry: entryData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.update) props.updateEntries(data.savedEntry);
        loadControl.setMouseNormal();
        props.exitEntry();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleEdit(event) {
    event.preventDefault();
    props.invertCreateMode();
    $("input").prop("disabled", false);
    $("textarea").prop("disabled", false);
  }

  function getFiles(event) {
    const files = event.target.files;
    console.log(event.target.files);
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      const type = event.target.files[i].type;
      const fileType = type.split("/")[0];
      reader.onload = function () {
        setEntryData((prev) => {
          let newMedia = prev.media;
          const keyList = Object.keys(newMedia);
          const valueList = Object.values(newMedia);
          const index = keyList.indexOf(fileType);
          let temp = null;
          temp = valueList[index];
          temp.push(reader.result);
          newMedia = {
            ...newMedia,
            [fileType]: [...new Set(temp)],
          };
          setMedia(true);
          return {
            ...prev,
            media: newMedia,
          };
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  }

  function removeMedia(type, id) {
    console.log("removing: " + id);
    let newMedia = entryData.media;
    const keyList = Object.keys(newMedia);
    const valueList = Object.values(newMedia);
    let arr = [];
    arr = valueList[keyList.indexOf(type)];
    arr.splice(id, 1);
    newMedia = {
      ...newMedia,
      [type]: arr,
    };
    setEntryData((prev) => {
      return {
        ...prev,
        media: newMedia,
      };
    });
  }

  function setDimensions() {
    let windowHeight = window.innerHeight;
    let footerHeight = $("#footer").outerHeight();
    let titleHeight = $("#title-div").outerHeight();
    $("#textInput").outerHeight(windowHeight - footerHeight - 25);
    let inputHeight = $("#textInput").outerHeight();
    $("#content-div").outerHeight(inputHeight - titleHeight);
    $("#media-div").outerHeight(windowHeight - footerHeight - 25);
  }

  function switchVisibility(visibility) {
    setEntryData((prev) => {
      return {
        ...prev,
        private: visibility,
      };
    });
  }

  function toggleVisibility() {
    switchVisibility(!isPrivate);
    setPrivate((prev) => {
      return !prev;
    });
  }

  function updateContent(content) {
    setEntryData((prev) => {
      return {
        ...prev,
        content: content,
      };
    });
  }

  return (
    <div>
      <div
        className="container-fluid width-100 text-input-container"
        id="textInput"
      >
        <form onSubmit={props.createMode ? handleSubmit : handleEdit}>
          <div className="row mx-5">
            {/* this column contains title + done button + content */}
            <div className="col-md-8 px-0">
              {/* container for title and done button */}
              <div
                className="container-fluid width-100 px-0 entry-title-container"
                id="title-div"
              >
                <div className="row title-done-button-row">
                  <div className="col-sm-11 px-0">
                    <input
                      className="entry-title"
                      type="text"
                      placeholder="Your Title"
                      onChange={handleTextChange}
                      name="title"
                      value={entryData.title}
                      onKeyDown={(event) => {
                        // console.log(event.keyCode);
                        if (event.keyCode === 13) event.preventDefault();
                      }}
                    ></input>
                  </div>
                  <div className="container-fluid col-sm-1 mx-auto">
                    {editable ? (
                      <IconButton className="mx-auto" type="submit">
                        {props.createMode ? (
                          <DoneIcon fontSize="large" sx={{ color: "white" }} />
                        ) : (
                          <EditIcon fontSize="large" sx={{ color: "white" }} />
                        )}
                      </IconButton>
                    ) : null}
                  </div>
                </div>
              </div>
              {/* container for content */}
              <div
                className="container-fluid px-0 entry-content-container"
                id="content-div"
              >
                {props.display === "Shared" ||
                props.passedEntry.shared.length > 0 ? (
                  <Shared
                    content={entryData.content}
                    entryID={entryData.entryID}
                    updateContent={updateContent}
                  />
                ) : (
                  <textarea
                    className="entry-content height-100"
                    placeholder="Write your thoughts away..."
                    onChange={handleTextChange}
                    name="content"
                    value={entryData.content}
                  ></textarea>
                )}
              </div>
            </div>
            {/* column for media attachments */}
            <div className="col-md-4 px-0">
              {!isMedia ? (
                <table className="height-100 width-100 table-class">
                  <tbody>
                    <tr>
                      <td className="no-media-container">
                        <p className="align-middle no-media date-p">
                          You haven't added any media yet
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <MediaTray
                  mediaData={entryData.media}
                  removeMedia={removeMedia}
                  ready={ready}
                  changeReady={changeReady}
                  createMode={props.createMode}
                />
              )}
              <input
                onChange={getFiles}
                type="file"
                id="files"
                multiple="multiple"
                name="files"
                accept="image/*, video/*, audio/*"
              />
            </div>
          </div>
        </form>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {isPrivate
                  ? "From Private to Public"
                  : "From Public to Private"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {isPrivate
                ? "Do you want to make your post public?"
                : "Do you want to make your post private?"}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                onClick={toggleVisibility}
                data-bs-dismiss="modal"
                className="btn btn-primary"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer
        isPrivate={isPrivate}
        addBkgAudio={addBkgAudio}
        addBkgImage={addBkgImage}
        return={props.exitEntry}
        setEnv={setEnv}
        createMode={props.createMode}
        entryData={entryData}
        switchVisibility={switchVisibility}
        currentUser={props.currentUser}
        display={props.display}
        entry={{
          entryID: entryData.entryID,
          owner: entryData.owner ? entryData.owner : props.currentUser.username,
          shared: entryData.shared,
          setShared: (shared) => {
            entryData.shared = shared;
          },
          weather: entryData.weather,
          date: entryData.date,
        }}
      />
      {setDimensions()}
    </div>
  );
}

export default EntryInput;
