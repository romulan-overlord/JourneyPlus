import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";

export default function NewComment(props) {

  function postComment(){}

  return (
    <div className="container-fluid">
      <div className="d-flex flex-start w-100">
        <Avatar src={props.currentUser.picture} className="me-2" />
        <div className="form-outline w-100">
          <textarea
            className="form-control"
            id="textAreaExample"
            rows={2}
            style={{ background: "#fff" }}
            defaultValue={""}
            placeholder="your message"
          />
          <div className="my-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={postComment}>
              Post comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
