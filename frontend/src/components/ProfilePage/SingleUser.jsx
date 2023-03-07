import React from "react";

function SingleUser(){
    return (
      <div className="d-flex align-items-center pb-1" id="tooltips-container">
        <img
          src="https://bootdey.com/img/Content/avatar/avatar2.png"
          className="rounded-circle img-fluid avatar-md img-thumbnail bg-transparent"
          alt=""
        ></img>
        <div className="w-100 ms-3">
          <h5 className="mb-1">Tomaslau</h5>
          <p className="mb-0 font-13">I've finished it! See you so...</p>
        </div>
        <button className="btn btn-danger unfollow-button" type="button">
          Unfollow
        </button>
      </div>
    );
}

export default SingleUser;