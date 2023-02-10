import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";

function TextInput() {
  const [entryData, setEntryData] = useState({
    title: "",
    content: "",
  });

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

  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8000/submit-entry", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div
      className="container-fluid width-100 text-input-container"
      id="textInput"
    >
      <form onSubmit={handleSubmit}>
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
                  ></input>
                </div>
                <div className="container-fluid col-sm-1 mx-auto">
                  <IconButton className="mx-auto" type="submit">
                    <DoneIcon fontSize="large" sx={{ color: "white" }} />
                  </IconButton>
                </div>
              </div>
            </div>
            {/* container for content */}
            <div
              className="container-fluid px-0 entry-content-container"
              id="content-div"
            >
              <textarea
                className="entry-content height-100"
                placeholder="Write your thoughts away..."
                onChange={handleTextChange}
                name="content"
                value={entryData.content}
              ></textarea>
            </div>
          </div>
          {/* column for media attachments */}
          <div className="col-md-4 px-0">
            <table className="height-100 width-100">
              <tbody>
                <tr>
                  <td className="no-media-container">
                    <p className="align-middle no-media">
                      You haven't added any media yet
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TextInput;
