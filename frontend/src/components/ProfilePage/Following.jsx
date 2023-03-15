import { indexOf } from "lodash";
import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import SingleUser from "./SingleUser";

function Following(props) {
  const [followingList, setFollowingList] = useState([]);
  const [check, setCheck] = useState(true);
  useEffect(() => {
    if (followingList.length === 0 && check) {
      fetchFollowing();
      setCheck(false);
    }
  });

  function getUsernameArray(arr) {
    const retArr = [];
    for (let i = 0; i < arr.length; i++) {
      retArr.push(arr[i].username);
    }
    return retArr;
  }

  function fetchFollowing() {
    fetch(expressIP + "/fetchFollowing", {
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
        setFollowingList(data.following);
        props.updateNetwork({ following: getUsernameArray(data.following) });
        //setUserList(data.users);
      });
  }
  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile d-flex">
          <div className="w-100">Following</div>
          <button
            onClick={props.invertUsers}
            className="btn btn-primary follow-more-button"
            type="button"
          >
            Discover
          </button>
        </div>
        <div className="card-body">
          {followingList.length !== 0
            ? followingList.map((follower, index) => {
                return (
                  <SingleUser
                    user={follower}
                    follow={"Unfollow"}
                    currentUser={props.currentUser}
                    updateNetwork={props.updateNetwork}
                    key={index}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default Following;
