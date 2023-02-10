import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import Header from "./Header";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(true);

  function invertIsSignedUp(event) {
    setIsSignedUp((prev) => {
      return !prev;
    });
  }

  return (
    <div className="App height-100">
      <Header />
      {isLoggedIn ? <TextInput /> : isSignedUp ? <SignIn switch={invertIsSignedUp} /> : <SignUp switch={invertIsSignedUp} />}
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
