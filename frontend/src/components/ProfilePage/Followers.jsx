import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import SingleUser from "./SingleUser";

function Followers(props) {
  const [followerList, setFollowerList] = useState([]);
  const [check, setCheck] = useState(true);
  useEffect(() => {
    if (followerList.length === 0 && check) {
      setCheck(false);
      fetchFollowers();
    }
  });

  function fetchFollowers() {
    console.log("fetching followers");
    fetch(expressIP + "/fetchFollowers", {
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
        console.log(data);
        setFollowerList(data.followers);
        //setUserList(data.users);
      });
  }

  function updateFollowers(followers){
    setFollowerList(followers)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile">Followers</div>
        <div className="card-body">
          {followerList.length !== 0
            ? followerList.map((follower, index) => {
                return (
                  <SingleUser
                    user={follower}
                    follow={"Remove"}
                    currentUser={props.currentUser}
                    updateNetwork={props.updateNetwork}
                    updateFollowers={updateFollowers}
                    key={index}
                    getForeignUser={props.getForeignUser}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}

export default Followers;
