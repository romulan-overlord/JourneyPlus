import React, { useState, useEffect } from "react";
import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import Footer from "./Footer"
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Login from "./Login";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  function invertIsSignedUp(event) {
    setIsSignedUp((prev) => {
      return !prev;
    });
  }

  return (
    <div className="App height-100">
      <Header />
      {isLoggedIn ? <EntryInput /> : isSignedUp ? <Login switch={invertIsSignedUp} /> : <SignUp switch={invertIsSignedUp} />}
      <Footer />
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
