import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import SingleUser from "./SingleUser";

function Followers(props) {
  const [followerList, setFollowerList] = useState([]);
  const [check, setCheck] = useState(true);
  const [filteredList, setFilteredList] = useState(followerList);
  useEffect(() => {
    if (followerList.length === 0 && check) {
      setCheck(false);
      fetchFollowers();
    }
  });

  const filterBySearch = (event) => {
    // Access input value
    const query = event.target.value;

    // Create copy of item list
    var updatedList = [...followerList];

    // Include all elements which includes the search query
    updatedList = updatedList.filter(function (item) {
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    // Trigger render with updated values
    setFilteredList(updatedList);
  };

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
        setFilteredList(data.followers);
      });
  }

  function updateFollowers(followers) {
    setFollowerList(followers);
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile">Followers</div>
        <div className="card-header">
          <input
            className="form-control"
            name="search"
            onChange={filterBySearch}
            id="search"
            type="text"
            placeholder="Search"
          ></input>
        </div>
        <div className="card-body">
          {followerList.length !== 0
            ? filteredList.map((follower, index) => {
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
