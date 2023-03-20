import React, { useState, useEffect } from "react";
import { expressIP } from "../../settings";

export default function UserFeed(props) {
  const [feedList, setFeedList] = useState([]);
  const [feedReady, setReady] = useState(false);

  useEffect(() => {
    if (!feedReady && feedList.length === 0) {
      fetchFeed();
      setReady(true);
    }
  });

  function fetchFeed(){
    fetch(expressIP + "/getUserFeed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.currentUser.username,
        cookieID: props.currentUser.cookieID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setFeedList(data.following);
        //setUserList(data.users);
      });
  }
}
