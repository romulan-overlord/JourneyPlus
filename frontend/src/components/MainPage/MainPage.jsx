import React, { useState, useEffect } from "react";
import { expressIP } from "../../settings";
import Card from "./Card";
import FeedPost from "./FeedPost";

function MainPage(props) {
  const [userReady, setUserReady] = useState(false);
  // const [entryList, setEntryList] = useState(props.currentUser.entries);
  const [feedList, setFeedList] = useState([]);
  const [feedReady, setFeedReady] = useState(false);
  const [sharedList, setSharedList] = useState([]);
  const [sharedReady, setSharedReady] = useState(false);

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
    if (props.display === "Shared" && sharedReady === false) {
      //send list of people i am following, fetch their public posts
      fetch(expressIP + "/getShared", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: props.currentUser.username }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSharedList(data.shared);
          setSharedReady(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setUserReady(true);
  });

  return (
    <div
      className="container-fluid px-lg-5 px-md-3 px-2 row entry-display-container"
      id="entryRow"
    >
      {userReady
        ? props.display !== "Feed" && props.display !== "Shared"
          ? props.currentUser.entries.map((entry, index) => {
              if (props.display === "Private" && entry.private === true)
                return (
                  <Card
                    entry={entry}
                    index={index}
                    key={index}
                    invertCompose={props.invertCompose}
                    openEntry={props.openEntry}
                    deleteEntry={props.deleteEntry}
                    private={true}
                    isFeed={false}
                    inFeedpost={false}
                  />
                );
              if (props.display === "Public" && entry.private === false) {
                const feed = {
                  creator: {
                    username: props.currentUser.username,
                    firstName: props.currentUser.firstName,
                    lastName: props.currentUser.lastName,
                    picture: props.currentUser.picture,
                    email: props.currentUser.email,
                    following: props.currentUser.following,
                    followers: props.currentUser.followers,
                  },
                  entry: entry,
                };
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
                    private={false}
                    isFeed={false}
                  />
                );
              }
            })
          : props.display === "Feed"
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
          : sharedList.map((feed, index) => {
            console.log("mapping : " + feed);
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
                shared={true}
              />
            );
          })
        : null}
    </div>
  );
}

export default MainPage;
