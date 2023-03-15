import React, { useState, useEffect } from "react";
import { expressIP } from "../../settings";
import Card from "./Card";
import FeedPost from "./FeedPost";

function MainPage(props) {
  const [userReady, setUserReady] = useState(false);
  // const [entryList, setEntryList] = useState(props.currentUser.entries);
  const [feedList, setFeedList] = useState([]);
  const [feedReady, setFeedReady] = useState(false);
  // const [publicReady, setPublicReady] = useState(false);

  useEffect(() => {
    if (props.display === "Feed" && feedReady === false) {
      //send list of people i am following, fetch their public posts
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
          setFeedReady(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // users personal posts are getting overwritten. fix pls.
    // if (publicReady === false) {
    //   setEntryList(props.currentUser.entries);
    //   setPublicReady(true);
    // }
    setUserReady(true);
  });

  return (
    <div
      className="container-fluid px-lg-5 px-md-3 px-2 row entry-display-container"
      id="entryRow"
    >
      {userReady
        ? props.display !== "Feed"
          ? props.currentUser.entries.map((entry, index) => {
              return (
                <Card
                  entry={entry}
                  index={index}
                  key={index}
                  invertCompose={props.invertCompose}
                  openEntry={props.openEntry}
                  deleteEntry={props.deleteEntry}
                  private={props.display === "Private" ? true : false}
                  isFeed={false}
                />
              );
            })
          : feedList.map((feed, index) => {
              return (
                <FeedPost
                  feed={feed}
                  index={index}
                  currentUser={{
                    username: props.currentUser.username,
                    cookieID: props.currentUser.cookieID
                  }}
                  key={index}
                  invertCompose={props.invertCompose}
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

export default MainPage;
