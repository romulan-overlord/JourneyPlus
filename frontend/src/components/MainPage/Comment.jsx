import React, { useState, useEffect } from "react";

function Comment(props) {
  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <p>Type your note, and hit enter to add it</p>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                alt="avatar"
                width={25}
                height={25}
              />
              <p className="small mb-0 ms-2">Martha</p>
            </div>
            <div className="d-flex flex-row align-items-center">
              <p className="small text-muted mb-0">Upvote?</p>
              <i
                className="far fa-thumbs-up mx-2 fa-xs text-black"
                style={{ marginTop: "-0.16rem" }}
              />
              <p className="small text-muted mb-0">3</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <p>Type your note, and hit enter to add it</p>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp"
                alt="avatar"
                width={25}
                height={25}
              />
              <p className="small mb-0 ms-2">Johny</p>
            </div>
            <div className="d-flex flex-row align-items-center">
              <p className="small text-muted mb-0">Upvote?</p>
              <i
                className="far fa-thumbs-up mx-2 fa-xs text-black"
                style={{ marginTop: "-0.16rem" }}
              />
              <p className="small text-muted mb-0">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
