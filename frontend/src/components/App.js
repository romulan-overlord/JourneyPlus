import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { expressIP } from "../settings";

import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import SignUp from "./SignUp";
import Login from "./Login";
import MainPage from "./MainPage/MainPage";
import ProfilePage from "./ProfilePage/ProfilePage";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [checkCookies, setCheckCookies] = useState(true);
  const [compose, setCompose] = useState(false);
  const [createMode, setCreateMode] = useState(true);
  const [passedEntry, setPassedEntry] = useState({
    entryID: "",
    title: "",
    content: "",
    media: {
      image: [],
      video: [],
      audio: [],
    },
    backgroundAudio: "",
    backgroundImage: "",
    date: "",
    weather: {
      desc: "",
      icon: "",
    },
  });

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [apiData, setApiData] = useState({});
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=45014d735557d276c6086a85e85ce49b`;

  const [cookies, setCookies] = useCookies([
    "userIsSaved",
    "username",
    "password",
  ]);

  const [profilePage, setProfilePage] = useState(false);

  function invertProfilePage(event){
    setProfilePage((prev) =>{
      return !prev;
    });
  }

  function invertIsSignedUp(event) {
    setIsSignedUp((prev) => {
      return !prev;
    });
  }

  function invertCompose() {
    setCompose((prev) => {
      return !prev;
    });
    $("body").css("background-image", "url(" + "./../images/img2.jpg" + ")");
    $("#footer").css("background-color", "#17263f");
    $("#footer").css("border-top", "none");
  }

  function openEntry(entry, bool) {
    invertCompose();
    setPassedEntry(entry);
    setCreateMode(bool);
  }

  function invertLoggedIn(event) {
    setLoggedIn((prev) => {
      return !prev;
    });
  }

  function updateCurrentUser(user) {
    let doResolve = false;
    return new Promise((resolve, reject) => {
      setCookies("userIsSaved", true);
      setCookies("username", user.username);
      setCookies("cookieID", user.cookieID);
      setCurrentUser(() => {
        doResolve = true;
        return { ...user };
      });
      if (doResolve === true) resolve();
    });
  }

  function logOut() {
    setCurrentUser({});
    setCookies("userIsSaved", false);
    setCookies("username", "");
    setCookies("cookieID", "");
    setCookies("password", "");
    invertLoggedIn();
  }

  function updateEntries(newEntry) {
    const newEntryArr = currentUser.entries;
    newEntryArr.push(newEntry);
    setCurrentUser((prev) => {
      return {
        ...prev,
        entries: newEntryArr,
      };
    });
  }

  // checking for cookies
  if (checkCookies === true && cookies.userIsSaved === "true") {
    setCheckCookies(false);
    const requestData = {
      username: cookies.username,
      cookieID: cookies.cookieID,
    };
    fetch(expressIP + "/auto-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
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
      {!compose ? (
        <Header
          invertCompose={invertCompose}
          logOut={logOut}
          invertProfilePage={invertProfilePage}
        />
      ) : null}
      {isLoggedIn ? (
        (compose ? (
          <EntryInput
            currentUser={currentUser}
            updateEntries={updateEntries}
            passedEntry={passedEntry}
            createMode={createMode}
            openEntry={openEntry}
          />
        ) : (
          <MainPage currentUser={currentUser} openEntry={openEntry} />
        ),
        profilePage ? (
          <ProfilePage currentUser={currentUser} logOut={logOut} />
        ) : (
          <MainPage currentUser={currentUser} openEntry={openEntry} />
        ))
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
