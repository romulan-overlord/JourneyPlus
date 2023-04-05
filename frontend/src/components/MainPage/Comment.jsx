import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { expressIP } from "../../settings";
import NewComment from "./NewComment";

function Comment(props) {
  const [liked, setLiked] = useState(
    props.comment.likedBy.includes(props.currentUser.username)
  );
  const [reply, setReply] = useState(false);

  function deleteComment() {
    fetch(expressIP + "/deleteComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data !== "error") props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deleteReply() {
    fetch(expressIP + "/deleteReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        parentID: props.parentID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data !== "error") props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function likeComment() {
    fetch(expressIP + "/likeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        likedBy: props.currentUser.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(true);
        props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function likeReply() {
    fetch(expressIP + "/likeReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        likedBy: props.currentUser.username,
        parentID: props.parentID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(true);
        props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function unlikeComment() {
    fetch(expressIP + "/unlikeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        unlikedBy: props.currentUser.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(false);
        props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function unlikeReply() {
    fetch(expressIP + "/unlikeReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        unlikedBy: props.currentUser.username,
        parentID: props.parentID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(false);
        props.updateComments(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          {props.editable ? (
            <div className="card-menu">
              <div className="dropdown card-dropdown">
                <a
                  className="btn btn-sm  bkg-btn"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <MoreVertIcon
                    className="date-p"
                    fontSize="small"
                    sx={{ color: "rgb(35,35,35)" }}
                  ></MoreVertIcon>
                </a>
                <ul className="dropdown-menu px-2">
                  <li
                    className="card-menu-item"
                    onClick={props.isComment ? deleteComment : deleteReply}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
          <p>{props.comment.comment}</p>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <Avatar
                src={
                  props.comment.commentorPic ? props.comment.commentorPic : null
                }
              />
              <p className="small mb-0 ms-2">{props.comment.commentor}</p>
            </div>
            <div className="d-flex flex-row align-items-center">
              {props.isComment ? (
                <ReplyOutlinedIcon
                  className="me-1"
                  fontSize="small"
                  onClick={() => {
                    setReply((prev) => !prev);
                  }}
                />
              ) : null}
              {liked ? (
                <FavoriteOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#C21010" }}
                  onClick={props.isComment ? unlikeComment : unlikeReply}
                />
              ) : (
                <FavoriteBorderIcon
                  fontSize="small"
                  onClick={props.isComment ? likeComment : likeReply}
                />
              )}
              <p
                className="small text-muted ms-1 mb-0"
                onClick={() => {
                  props.fetchLikers(props.comment.likedBy);
                }}
                data-bs-toggle="modal"
                data-bs-target="#likeList"
              >
                {props.comment.likes}
              </p>
              {/* <p className="small text-muted mb-0">Upvote?</p>
              <i
                className="far fa-thumbs-up mx-2 fa-xs text-black"
                style={{ marginTop: "-0.16rem" }}
              />
              <p className="small text-muted mb-0">3</p> */}
            </div>
          </div>

          {reply ? (
            <div className="card-footer">
              <NewComment
                currentUser={props.currentUser}
                post={props.post}
                updateComments={props.updateComments}
                reply={true}
                commentID={props.comment.commentID}
              />
              {props.comment.replies.map((reply, index) => {
                return (
                  <Comment
                    editable={
                      props.currentUser.username === reply.commentor
                        ? true
                        : false
                    }
                    comment={reply}
                    post={props.post}
                    currentUser={props.currentUser}
                    updateComments={props.updateComments}
                    fetchLikers={props.fetchLikers}
                    key={index}
                    parentID={props.comment.commentID}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Comment;
