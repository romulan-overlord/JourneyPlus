import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { expressIP } from "../../settings";

function Comment(props) {
  const [liked, setLiked] = useState(props.comment.likedBy.includes(props.currentUser));

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

  function likeComment() {
    fetch(expressIP + "/likeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentID: props.comment.commentID,
        entryID: props.post,
        likedBy: props.currentUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(true);
        props.updateComments(data.data)
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
        unlikedBy: props.currentUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLiked(false);
        props.updateComments(data.data)
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
                  <li className="card-menu-item" onClick={deleteComment}>
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
              {liked ? (
                <FavoriteOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#C21010" }}
                  onClick={unlikeComment}
                />
              ) : (
                <FavoriteBorderIcon fontSize="small" onClick={likeComment} />
              )}
              {/* <p className="small text-muted mb-0">Upvote?</p>
              <i
                className="far fa-thumbs-up mx-2 fa-xs text-black"
                style={{ marginTop: "-0.16rem" }}
              />
              <p className="small text-muted mb-0">3</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
