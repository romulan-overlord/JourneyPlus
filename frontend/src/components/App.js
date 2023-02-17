import React, { useState } from "react";
import $ from "jquery";
import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import SignUp from "./SignUp";
import Login from "./Login";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  function invertIsSignedUp(event) {
    setIsSignedUp((prev) => {
      return !prev;
    });
  }

  function invertLoggedIn(event) {
    setLoggedIn((prev) => {
      return !prev;
    });
  }
 
  function setDimensions() {
    let windowHeight = window.innerHeight;
    let headerHeight = $("#header").outerHeight();
    let footerHeight = $("#footer").outerHeight();
    let titleHeight = $("#title-div").outerHeight();
    $("#textInput").outerHeight(windowHeight - headerHeight - footerHeight);
    let inputHeight = $("#textInput").outerHeight();
    $("#content-div").outerHeight(inputHeight - titleHeight);

    console.log("native script running");
    console.log(
      "window: " +
        windowHeight +
        " header: " +
        headerHeight +
        " input area: " +
        $("#textInput").outerHeight() +
        " title: " +
        titleHeight +
        " content: " +
        $("#content-div").outerHeight()
    );
  }

  return (
    <div className="App height-100">
      <Header />
      {isLoggedIn ? (
        <EntryInput />
      ) : isSignedUp ? (
        <Login invertLoggedIn={invertLoggedIn} switch={invertIsSignedUp} />
      ) : (
        <SignUp switch={invertIsSignedUp} />
      )}
      {setDimensions()}
    </div>
  );
}

export default App;

// const [message, setMessage] = useState("");

// useEffect(() => {
//   fetch("http://localhost:8000/message")
//     .then((res) => res.json())
//     .then((data) => setMessage(data.message));
// }, []);
