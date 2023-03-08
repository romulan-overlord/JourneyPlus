import React, { useState } from "react";
import { expressIP } from "../../settings";

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
        props.updateNetwork();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleUnfollow(){
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
        console.log(data);
        setFollow("follow");
        props.updateNetwork(props.user.username);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="d-flex align-items-center pb-1" id="tooltips-container">
      <img
        src="{props.user.picture}"
        className="rounded-circle img-fluid avatar-md img-thumbnail bg-transparent"
        alt=""
      ></img>
      <div className="w-100 ms-3">
        <h5 className="mb-1">{props.user.firstName}</h5>
        <p className="mb-0 font-13">{props.user.username}</p>
      </div>
      {isFollow==="follow" ? (
        <button
          className="btn btn-primary unfollow-button"
          type="button"
          onClick={handleFollow}
        >
          Follow
        </button>
      ) : (
        <button
          className="btn btn-danger unfollow-button"
          type="button"
          onClick={handleUnfollow}
        >
          {props.follow}
        </button>
      )}
    </div>
  );
}

export default SingleUser;
