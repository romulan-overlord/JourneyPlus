import React, { useState } from "react";
import { useCookies } from "react-cookie";

import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import SignUp from "./SignUp";
import Login from "./Login";
import MainPage from "./MainPage";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [checkCookies, setCheckCookies] = useState(true)

  const [cookies, setCookies] = useCookies([
    "userIsSaved",
    "username",
    "password",
  ]);

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

  function updateCurrentUser(user) {
    setCurrentUser(() => {
      return { ...user };
    });
    setCookies("userIsSaved", true);
    setCookies("username", user.username);
    setCookies("cookieID", user.cookieID);
  }

  function logOut(){
    setCurrentUser({});
    setCookies("userIsSaved", false);
    setCookies("username", "");
    setCookies("cookieID", "");
    setCookies("password", "");
    invertLoggedIn();
  }


  // checking for cookies
  if (checkCookies === true && cookies.userIsSaved === "true") {
    setCheckCookies(false);
    const requestData = {
      username: cookies.username,
      cookieID: cookies.cookieID,
    };
    fetch("http://localhost:8000/auto-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "802") {
          updateCurrentUser(data.user);
          invertLoggedIn();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="App height-100">
      <Header logOut={logOut} />
      {isLoggedIn ? (
        <MainPage currentUser={currentUser} />
      ) : isSignedUp ? (
        <Login
          invertLoggedIn={invertLoggedIn}
          switch={invertIsSignedUp}
          updateCurrentUser={updateCurrentUser}
        />
      ) : (
        <SignUp invertIsSignedUp={invertIsSignedUp} switch={invertIsSignedUp} />
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
