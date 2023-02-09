import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import { white } from '@mui/material/colors';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    submit: {
      main: "#fff",
      contrastText: "#fff",
      white: '#fff'
    },
  },
});

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
    <div className="container-fluid width-100 text-input-container">
      <div className="row mx-5">
        {/* this column contains title + done button + content */}
        <div className="col-md-8 px-0">
          {/* container for title and done button */}
          <div className="container-fluid width-100 px-0 entry-title-container">
            <div className="row title-done-button-row">
              <div className="col-sm-11 px-0">
                <input
                  className="entry-title"
                  type="text"
                  placeholder="Your Title"
                ></input>
              </div>
              <div className="container-fluid col-sm-1 mx-auto">
                <ThemeProvider theme={theme}>
                <IconButton className="mx-auto">
                  <DoneIcon fontSize="large" sx={{color:'white'}} />
                </IconButton>
                </ThemeProvider>
                
              </div>
            </div>
          </div>
          {/* container for content */}
          <div className="container-fluid px-0 entry-content-container">
            <textarea className="entry-content" placeholder="Write your thoughts away..." rows={20}></textarea>
          </div>
        </div>
        {/* column for media attachments */}
        <div className="col-md-4 px-0"></div>
      </div>
    </div>
  );
}

export default TextInput;

{
  /* <div>
      <form className="entry-area" onSubmit={handleSubmit}>
        <TextField
          className="text-area"
          name="title"
          id="outlined-textarea"
          onChange={handleTextChange}
          value={entryData.title}
          margin="normal"
          placeholder="Your title..."
          minRows={1}
        />
        <TextField
          className="text-area"
          name="content"
          id="outlined-textarea"
          onChange={handleTextChange}
          value={entryData.content}
          margin="normal"
          placeholder="Your story..."
          multiline
          minRows={20}
          maxRows={20}
        />
        <ThemeProvider theme={theme}>
          <Button color="submit" type="submit" variant="contained">
            Submit
          </Button>
        </ThemeProvider>
      </form>
    </div> */
}
