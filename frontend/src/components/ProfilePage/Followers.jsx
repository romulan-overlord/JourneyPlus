import React from "react";
import SingleUser from "./SingleUser";

function Followers(){
    return (
      <div className="container">
        <div className="card">
          <div className="card-header-profile">Followers</div>
          <div className="card-body">
            <SingleUser />
          </div>
        </div>
      </div>
    );
}

export default Followers;