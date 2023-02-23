import React, { useState } from "react";
import { useCookies } from "react-cookie";

import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import SignUp from "./SignUp";
import Login from "./Login";
import Footer from "./Footer";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState({ test: false });

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
      console.log("in setter");
      return { ...user };
    });
    setCookies("userIsSaved", true);
    setCookies("username", user.username);
    setCookies("password", user.password);
  }

  console.log("wat is happen?" + typeof(cookies.userIsSaved));
  // checking for cookies
  if (cookies.userIsSaved === "true") {
    console.log("checking cookies");
    console.log(cookies.userIsSaved);
    console.log(cookies.username);
    console.log(cookies.password);
    const requestData = {
      username: cookies.username,
      password: cookies.password,
    };
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === "802") {
          // console.log(data);
          // props.updateCurrentUser(data.user);
          console.log('it works!!!!!');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="App height-100">
      <Header />
      {isLoggedIn ? (
        <EntryInput />
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
