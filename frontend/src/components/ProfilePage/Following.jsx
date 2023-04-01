import { indexOf } from "lodash";
import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import $ from "jquery";
import SingleUser from "./SingleUser";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

function Following(props) {
  const [followingList, setFollowingList] = useState([]);
  const [check, setCheck] = useState(true);
  const [filteredList, setFilteredList] = useState(followingList);
  const [searchBar, setSearchBar] = useState(false);
  useEffect(() => {
    if (followingList.length === 0 && check) {
      fetchFollowing();
      setCheck(false);
    }
  });

  function handleSearchBar() {
    setSearchBar((prev) => {
      return !prev;
    });
  }

  const filterBySearch = (event) => {
    // Access input value
    const query = event.target.value;

    // Create copy of item list
    var updatedList = [...followingList];

    // Include all elements which includes the search query
    updatedList = updatedList.filter(function (item) {
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    // Trigger render with updated values
    setFilteredList(updatedList);
  };

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
        setFilteredList(data.following);
      });
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile d-flex">
          <div className="w-100">
            Following
            <span id="search-icon"onClick={handleSearchBar}>
              <IconButton>
                <SearchIcon />
              </IconButton>
            </span>
          </div>
          <button
            onClick={props.invertUsers}
            className="btn btn-primary follow-more-button"
            type="button"
          >
            Discover
          </button>
        </div>
        {searchBar ? (
          <div className="card-header" id="following-search">
            <input
              className="form-control"
              name="search"
              onChange={filterBySearch}
              id="search"
              type="text"
              placeholder="Search"
            ></input>
          </div>
        ) : null}

        <div className="card-body">
          {followingList.length !== 0
            ? filteredList.map((follower, index) => {
                return (
                  <SingleUser
                    user={follower}
                    follow={"Unfollow"}
                    currentUser={props.currentUser}
                    updateNetwork={props.updateNetwork}
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

export default Following;
