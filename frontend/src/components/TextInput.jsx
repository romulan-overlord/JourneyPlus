import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    submit: {
      main: "#82CD47",
      contrastText: "#fff",
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
    setEntryData((prev) => {
      return {
        ...prev,
        content: newData,
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
    <div>
      <form className="entry-area" onSubmit={handleSubmit}>
        <TextField
          className="text-area"
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
    </div>
  );
}

export default TextInput;
