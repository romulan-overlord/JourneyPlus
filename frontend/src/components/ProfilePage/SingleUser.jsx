import React, { useState } from "react";
import $ from "jquery";
import { expressIP } from "../../settings";
import { Avatar } from "@mui/material";

function SingleUser(props) {
  const [isFollow, setFollow] = useState(props.follow);

  function handleFollow() {
    fetch(expressIP + "/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.currentUser.username,
        cookieID: props.currentUser.cookieID,
        follow: props.user.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFollow("Unfollow");
        props.updateNetwork({
          following: [...props.currentUser.following, props.user.username],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleUnfollow() {
    fetch(expressIP + "/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.currentUser.username,
        cookieID: props.currentUser.cookieID,
        unfollow: props.user.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setFollow("Follow");
        let myFollowing = props.currentUser.following;
        let index = myFollowing.indexOf(props.user.username);
        myFollowing.splice(index, 1);
        props.updateNetwork({
          following: myFollowing,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleRemove() {
    fetch(expressIP + "/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.user.username,
        unfollow: props.currentUser.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setFollow("");
        let myFollowers = props.currentUser.followers;
        let index = myFollowers.indexOf(props.user.username);
        myFollowers.splice(index, 1);
        props.updateNetwork({
          followers: myFollowers,
        });
        props.updateFollowers(myFollowers);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleShare() {
    fetch(expressIP + "/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shareTo: props.user.username,
        entryID: props.entryID,
        owner: props.owner,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.setShared(data.list);
        setFollow("Unshare");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleUnshare(){
    fetch(expressIP + "/unshare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unshareTo: props.user.username,
        entryID: props.entryID,
        owner: props.owner,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.setShared(data.list);
        setFollow("Share");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //write function that fetches user details from server and calls props.getforeignUser

  return (
    <div className="d-flex align-items-center pb-1" id="tooltips-container">
      <Avatar src={props.user.picture} />
      <div className="w-100 ms-3">
        <h5
          onClick={() => {
            props.getForeignUser(props.user);
          }}
          className="mb-1"
          data-bs-dismiss="modal"
        >
          {props.user.firstName}
        </h5>
        <p className="mb-0 font-13">{props.user.username}</p>
      </div>
      {isFollow === "Follow" ? (
        <button
          className="btn btn-primary unfollow-button"
          type="button"
          onClick={handleFollow}
        >
          {isFollow}
        </button>
      ) : isFollow === "Unfollow" ? (
        <button
          className="btn btn-danger unfollow-button"
          type="button"
          onClick={handleUnfollow}
        >
          {isFollow}
        </button>
      ) : isFollow === "Remove" ? (
        <button
          className="btn btn-danger unfollow-button"
          type="button"
          onClick={handleRemove}
        >
          {isFollow}
        </button>
      ) : isFollow === "Share" && props.user.email !== "no@mail.in" ? (
        <button
          className="btn btn-primary unfollow-button"
          type="button"
          onClick={handleShare}
        >
          {isFollow}
        </button>
      ) : isFollow === "Unshare" && props.user.email !== "no@mail.in" ? (
        <button
          className="btn btn-danger unfollow-button"
          type="button"
          onClick={handleUnshare}
        >
          {isFollow}
        </button>
      ) : null}
    </div>
  );
}

export default SingleUser;
