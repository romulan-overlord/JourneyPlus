import React from "react";
import SingleUser from "./SingleUser";

function Following(props){
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
            <SingleUser />
          </div>
        </div>
      </div>
    );
     
}

export default Following;