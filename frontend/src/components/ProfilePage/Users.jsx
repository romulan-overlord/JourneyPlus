import React from "react";
import SingleUser from "./SingleUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Users(props){
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
            <SingleUser />
          </div>
        </div>
      </div>
    );
    
}

export default Users;