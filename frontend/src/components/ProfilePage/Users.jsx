import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import SingleUser from "./SingleUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

function Users(props) {
  const [userList, setUserList] = useState([]);
  const [check, setCheck] = useState(true);
  const [filteredList, setFilteredList] = useState(userList);
  const [searchBar, setSearchBar] = useState(false);

  useEffect(() => {
    if (userList.length === 0 && check) {
      fetchUsers();
      setCheck(false);
    }
  });

  function handleSearchBar(){
    setSearchBar((prev) => {
      return !prev;
    });
  }

  const filterBySearch = (event) => {
  // Access input value
  const query = event.target.value;

  // Create copy of item list
  var updatedList = [...userList];

  // Include all elements which includes the search query
  updatedList = updatedList.filter(function(item){
    return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;  
  });
    
  // Trigger render with updated values
  setFilteredList(updatedList);
  };

  function fetchUsers() {
    fetch(expressIP + "/fetchUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...props.currentUser }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Users: " + data);
        setUserList(data.users);
        setFilteredList(data.users);
      });
  }
  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile d-flex">
          <div className="w-100">
            Users
            <span onClick={handleSearchBar}>
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
            <ArrowBackIcon />
          </button>
        </div>
        
          {searchBar ? (
            <div className="card-header">
            <input
              className="form-control"
              name="search"
              id="search-box"
              onChange={filterBySearch}
              type="text"
              placeholder="Search"
            ></input>
            </div>
          ) : null}
        
        <div className="card-body">
          {userList.length !== 0
            ? filteredList.map((user, index) => {
                return (
                  <SingleUser
                    user={user}
                    follow={"Follow"}
                    currentUser={props.currentUser}
                    updateNetwork={props.updateNetwork}
                    key={index}
                    getForeignUser={props.getForeignUser}
                  />
                );
              })
            : null}
          {/* <SingleUser /> */}
        </div>
      </div>
    </div>
  );
}

export default Users;
