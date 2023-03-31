import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { expressIP, defaultEntry } from "../settings";

import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header/Header";
import SignUp from "./SignUp";
import Login from "./Login";
import MainPage from "./MainPage/MainPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import SharedEntry from "./EntryInput/badCode";
import Help from "./EntryInput/Help";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [checkCookies, setCheckCookies] = useState(true);
  const [compose, setCompose] = useState(false);
  const [createMode, setCreateMode] = useState(true);
  const [display, setDisplay] = useState("Private");
  const [profilePage, setProfilePage] = useState(false);
  //useState to toggle display of another user's profile
  const [selfProfile, setSelfProfile] = useState(true);
  //useState to store details of foreignUser
  const [foreignUser, setForeignUser] = useState({});
  const [passedEntry, setPassedEntry] = useState(defaultEntry);

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [apiData, setApiData] = useState({});
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=45014d735557d276c6086a85e85ce49b`;

  const [cookies, setCookies] = useCookies([
    "userIsSaved",
    "username",
    "password",
  ]);

  function invertProfilePage(event) {
    setProfilePage((prev) => {
      return !prev;
    });
    setSelfProfile(true);
  }

  function invertIsSignedUp(event) {
    setIsSignedUp((prev) => {
      return !prev;
    });
  }

  function setVisibility(visibility) {
    setDisplay(visibility);
  }

  function invertCompose() {
    setCompose((prev) => {
      return !prev;
    });
    $("body").css("background-image", "url(" + "./../images/img2.jpg" + ")");
    $("#footer").css("background-color", "#17263f");
    $("#footer").css("border-top", "none");
  }

  function invertCreateMode() {
    setCreateMode((prev) => {
      return !prev;
    });
  }

  function openEntry(entry, bool) {
    fetch(expressIP + "/getFullData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(entry),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        invertCompose();
        setPassedEntry(data);
        setCreateMode(bool);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deleteEntry(entryID) {
    console.log(expressIP + "/removeEntry");
    fetch(expressIP + "/removeEntry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        user: currentUser.username,
        entryID: entryID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // invertCompose();
        // setPassedEntry(data);
        // setCreateMode(bool);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    const newEntryArr = currentUser.entries;
    for (let i = 0; i < newEntryArr.length; i++) {
      if (newEntryArr[i].entryID === entryID) {
        newEntryArr.splice(i, 1);
      }
    }
    setCurrentUser((prev) => {
      return {
        ...prev,
        entries: newEntryArr,
      };
    });
  }

  function exitEntry() {
    invertCompose();
    setPassedEntry(defaultEntry);
    setCreateMode(true);
  }

  function invertLoggedIn(event) {
    setLoggedIn((prev) => {
      return !prev;
    });
  }

  function updateCurrentUser(user, remember) {
    let doResolve = false;
    return new Promise((resolve, reject) => {
      if (remember) {
        setCookies("userIsSaved", true);
        setCookies("username", user.username);
        setCookies("cookieID", user.cookieID);
      }
      setCurrentUser(() => {
        doResolve = true;
        return { ...user };
      });
      if (doResolve === true) resolve();
    });
  }

  function updateUserDetails(update) {
    setCurrentUser((prev) => {
      return {
        ...prev,
        ...update,
      };
    });
    // if (update.username) setCookies("username", update.username);
  }

  function updateNetwork(update) {
    setCurrentUser((prev) => {
      return {
        ...prev,
        ...update,
      };
    });
  }

  function logOut() {
    setCurrentUser({});
    setCookies("userIsSaved", false);
    setCookies("username", "");
    setCookies("cookieID", "");
    setCookies("password", "");
    invertLoggedIn();
    invertProfilePage();
  }

  function updateEntries(newEntry) {
    const newEntryArr = currentUser.entries;
    for (let i = 0; i < newEntryArr.length; i++) {
      if (newEntryArr[i].entryID === newEntry.entryID) {
        newEntryArr.splice(i, 1);
      }
    }
    newEntryArr.push(newEntry);
    setCurrentUser((prev) => {
      return {
        ...prev,
        entries: newEntryArr,
      };
    });
  }

  function updatePicture(picture) {
    setCurrentUser((prev) => {
      return { ...prev, picture: picture };
    });
  }

  function getForeignUser(user) {
    console.log("getting foreign user");
    // setProfilePage((prev) => !prev);
    setProfilePage(true);
    setSelfProfile(false);
    setForeignUser(user);
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
          isLoggedIn={isLoggedIn}
          profilePage={profilePage}
          invertCompose={invertCompose}
          invertProfilePage={invertProfilePage}
          display={display}
          setVisibility={setVisibility}
          currentUser={currentUser}
          picture={currentUser === undefined ? "" : currentUser.picture}
        />
      ) : null}
      {isLoggedIn ? (
        compose ? (
          <EntryInput
            currentUser={currentUser}
            updateEntries={updateEntries}
            passedEntry={passedEntry}
            createMode={createMode}
            invertCreateMode={invertCreateMode}
            exitEntry={exitEntry}
            display={display}
          />
          // <SharedEntry currentUser={currentUser} />
          // <Help />
        ) : !profilePage ? (
          <MainPage
            currentUser={currentUser}
            openEntry={openEntry}
            deleteEntry={deleteEntry}
            display={display}
            getForeignUser={getForeignUser}
          />
        ) : (
          <ProfilePage
            invertLoggedIn={invertLoggedIn}
            invertProfilePage={invertProfilePage}
            updateUserDetails={updateUserDetails}
            currentUser={currentUser}
            foreignUser={foreignUser}
            logOut={logOut}
            updateNetwork={updateNetwork}
            updatePicture={updatePicture}
            openEntry={openEntry}
            getForeignUser={getForeignUser}
            selfProfile={selfProfile}
          />
        )
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
