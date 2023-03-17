import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Card from "./Card";
import { expressIP } from "../../settings";
import Comment from "./Comment";
import NewComment from "./NewComment";

function FeedPost(props) {
  const [likes, setLikes] = useState({});
  const [ready, setReady] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isComment, setComment] = useState(false);

  useEffect(() => {
    if (ready) {
      fetchDetails();
      setReady(false);
    }
  });

  function updateComments(update) {
    setLikes(update);
  }

  function toggleComments() {
    setComment((prev) => !prev);
  }

  function fetchDetails() {
    fetch(expressIP + "/getLikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entryID: props.feed.entry.entryID }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setLikes(data);
        setLiked(data.likedBy.includes(props.currentUser.username));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleLike() {
    fetch(expressIP + "/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entryID: props.feed.entry.entryID,
        likedBy: props.currentUser.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLikes((prev) => {
          return {
            ...prev,
            likes: prev.likes + 1,
          };
        });
        setLiked(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleUnlike() {
    fetch(expressIP + "/unlike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entryID: props.feed.entry.entryID,
        unlikedBy: props.currentUser.username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLikes((prev) => {
          return {
            ...prev,
            likes: prev.likes - 1,
          };
        });
        setLiked(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <section
      className="px-0"
      style={{ backgroundColor: "rgba(200,200,200,0.5)" }}
    >
      <div className="container mb-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-10 col-xl-8">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-start align-items-center">
                  <Avatar src={props.feed.creator.picture} className="me-2" />
                  <div>
                    <h6 className="fw-bold text-primary mb-1">
                      {props.feed.creator.firstName +
                        " " +
                        props.feed.creator.lastName}
                    </h6>
                    <p className="text-muted small mb-0">
                      {"@" + props.feed.creator.username}
                    </p>
                  </div>
                </div>
                {/* this div will hold the public post */}
                <div className="mt-1">
                  <Card
                    entry={props.feed.entry}
                    index={props.index}
                    // key={index}
                    invertCompose={props.invertCompose}
                    openEntry={props.openEntry}
                    deleteEntry={props.deleteEntry}
                    private={props.private}
                    isFeed={true}
                  />
                  <div className="p-2">
                    <Stack direction="row" spacing={1.5}>
                      {liked ? (
                        <FavoriteOutlinedIcon
                          sx={{ color: "#C21010" }}
                          onClick={handleUnlike}
                        />
                      ) : (
                        <FavoriteBorderIcon onClick={handleLike} />
                      )}
                      <MapsUgcOutlinedIcon onClick={toggleComments} />
                      <ReplyOutlinedIcon />
                      <p>{likes.likes + " likes"}</p>
                    </Stack>
                  </div>

                  {/* <p className="mt-3 mb-0 lead feed-title">{props.feed.entry.title}</p>
                  <p className="mt-1 mb-4 pb-2">{props.feed.entry.content}</p> */}
                </div>
              </div>
              <div className="card-footer">
                {isComment ? (
                  <>
                    <NewComment
                      currentUser={props.currentUser}
                      post={props.feed.entry.entryID}
                      updateComments={updateComments}
                    />
                    {likes.comments.map((comment) => {
                      return (
                        <Comment
                          editable={
                            props.currentUser.username === comment.commentor
                              ? true
                              : false
                          }
                          comment={comment}
                          post={props.feed.entry.entryID}
                          updateComments={updateComments}
                        />
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// function FeedPost(props) {
//   return (
//     <div class="card p-0 px-lg-5 px-md-3">
//       <div class="card-header d-flex align-items-center">
//       <img
//         src="{props.user.picture}"
//         className="rounded-circle img-fluid avatar-md img-thumbnail bg-transparent"
//         alt=""
//       ></img>
//       <div className="w-100 ms-3">
//         <h5 className="mb-1">{props.author.firstName}</h5>
//         <p className="mb-0 font-13">{props.author.username}</p>
//       </div>
//       </div>
//       <div class="card-body p-0">
//         <Card
//           entry={props.entry}
//           index={props.index}
//           // key={index}
//           invertCompose={props.invertCompose}
//           openEntry={props.openEntry}
//           deleteEntry={props.deleteEntry}
//           private={props.private}
//           isFeed={true}
//         />
//       </div>
//     </div>
//   );
// }

export default FeedPost;
