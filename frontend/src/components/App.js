import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import EntryInput from "./EntryInput/EntryInput";
import Header from "./Header";
import SignUp from "./SignUp";
import Login from "./Login";
import MainPage from "./MainPage/MainPage";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [checkCookies, setCheckCookies] = useState(true);

  // const [lat, setLat] = useState([]);
  // const [long, setLong] = useState([]);
  // const [apiData, setApiData] = useState({});
  // const apiUrl = `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=45014d735557d276c6086a85e85ce49b`;

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
    let doResolve = false;
    return new Promise( (resolve, reject) => {  
      setCookies("userIsSaved", true);
      setCookies("username", user.username);
      setCookies("cookieID", user.cookieID);
      setCurrentUser(() => {
        doResolve=true;
      return { ...user };
      });
      if(doResolve === true)
        resolve();
    })
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

  // useEffect(() => {
  //   const fetchData = async () =>{
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       setLat(position.coords.latitude);
  //       setLong(position.coords.longitude);
  //     });
  //    setTimeout(() =>{
  //      fetch(apiUrl)
  //       .then((res) => res.json())
  //       .then((result) => {
  //         setApiData(result);
  //         console.log(result);
  //       });
  //    }, 5000)
      
  //   }
  //   fetchData();
  // }, [lat, long])
  
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
