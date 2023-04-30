import React, { useState, useEffect } from "react";
import FeedPost from "./FeedPost";
import { expressIP } from "../../settings";

export default function Feed(props) {
  const [feedList, setFeedList] = useState([]);

  useEffect(() => {
    fetch(expressIP + "/getFeed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ following: props.currentUser.following }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFeedList(data.feed);
        // setFeedReady(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      {feedList
        ? feedList.map((feed, index) => {
            return (
              <FeedPost
                feed={feed}
                index={index}
                currentUser={{
                  username: props.currentUser.username,
                  cookieID: props.currentUser.cookieID,
                  picture: props.currentUser.picture,
                }}
                getForeignUser={props.getForeignUser}
                key={index}
                openEntry={props.openEntry}
                deleteEntry={props.deleteEntry}
                private={props.display === "Private" ? true : false}
                isFeed={true}
              />
            );
          })
        : null}
    </div>
  );
}
