import React, { useState, useEffect } from "react";
import { expressIP } from "./../../settings";
import SingleUser from "./SingleUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Users(props) {
  const [userList, setUserList] = useState([]);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    if (userList.length === 0 && check) {
      fetchUsers();
      setCheck(false);
    }
  });
  function fetchUsers() {
    fetch(expressIP + "/fetchUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...props.currentUser}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Users: " + data);
        setUserList(data.users);
      });
  }
  return (
    <div className="container">
      <div className="card">
        <div className="card-header-profile d-flex">
          <div className="w-100">Users</div>
          <button
            onClick={props.invertUsers}
            className="btn btn-primary follow-more-button"
            type="button"
          >
            <ArrowBackIcon />
          </button>
        </div>
        <div className="card-body">
          {userList.length !== 0
            ? userList.map((user, index) => {
                return (
                  <SingleUser
                    user={user}
                    follow={"Follow"}
                    currentUser={props.currentUser}
                    updateNetwork={props.updateNetwork}
                    key={index}
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
