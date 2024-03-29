import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import { expressIP } from "../../settings";
import Comment from "./Comment";

export default function NewComment(props) {
  const [comment, setComment] = useState("");

  function handleComment(event) {
    const data = event.target.value;
    setComment(data);
  }

  function postComment() {
    if (comment.length < 1) {
      return;
    }
    fetch(expressIP + "/postComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        commentor: props.currentUser.username,
        commentorPic: props.currentUser.picture,
        post: props.post,
        timePosted: Date.now()
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.updateComments(data.update);
        setComment("");
        // setLikes(data);
        // setLiked(data.likedBy.includes(props.currentUser.username));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function postReply() {
    if (comment.length < 1) {
      return;
    }
    fetch(expressIP + "/postReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        commentor: props.currentUser.username,
        commentorPic: props.currentUser.picture,
        post: props.post,
        commentID: props.commentID,
        timePosted: Date.now(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        props.updateComments(data.update);
        setComment("");
        // setLikes(data);
        // setLiked(data.likedBy.includes(props.currentUser.username));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="container-fluid">
      <div className="d-flex flex-start w-100">
        {/* <Avatar src={props.currentUser.picture} className="me-2" /> */}
        <div className="form-outline w-100">
          <textarea
            className="form-control"
            id="textAreaExample"
            rows={2}
            style={{ background: "#fff" }}
            placeholder={props.reply ? "your reply" : "your message"}
            onChange={handleComment}
            value={comment}
          />
          <div className="my-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={props.reply ? postReply : postComment}
            >
              {props.reply ? "Post reply" : "Post comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
