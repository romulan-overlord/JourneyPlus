import React, { useState } from "react";

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
