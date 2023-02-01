import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import ResponsiveAppBar from "./Header";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <ResponsiveAppBar />
      <p>{message}</p>
      <TextInput />
    </div>
  );
}

export default App;
