import React, { useState, useEffect } from "react";
import { expressIP } from "../../settings";
import FeedPost from "./../MainPage/FeedPost";

export default function UserFeed(props) {
  const [feedList, setFeedList] = useState([]);
  const [feedReady, setReady] = useState(false);

  useEffect(() => {
    if (!feedReady && feedList.length === 0) {
      fetchFeed();
      setReady(true);
    }
  });

  function fetchFeed() {
    console.log("fetching feed");
    fetch(expressIP + "/getUserFeed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.foreignUser.username,
        cookieID: props.foreignUser.cookieID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("gift from kpop" + data.feed);
        setFeedList(data.feed);
        //setUserList(data.users);
      });
  }

  return (
    <div>
      {feedList.map((feed, index) => {
        return (
          <FeedPost
            feed={feed}
            index={index}
            currentUser={props.currentUser}
            getForeignUser={props.getForeignUser}
            key={index}
            openEntry={props.openEntry}
            private={false}
            isFeed={true}
            openProfile={props.openProfile}
          />
        );
      })}
    </div>
  );
}
