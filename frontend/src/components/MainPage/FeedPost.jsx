import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Card from "./Card";

function FeedPost(props) {
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
                      <FavoriteBorderIcon />
                      <MapsUgcOutlinedIcon />
                      <ReplyOutlinedIcon />
                    </Stack>
                  </div>

                  {/* <p className="mt-3 mb-0 lead feed-title">{props.feed.entry.title}</p>
                  <p className="mt-1 mb-4 pb-2">{props.feed.entry.content}</p> */}
                </div>
              </div>
              {/* <div
                className="card-footer py-3 border-0"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex flex-start w-100">
                  <img
                    className="rounded-circle shadow-1-strong me-3"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                  <div className="form-outline w-100">
                    <textarea
                      className="form-control"
                      id="textAreaExample"
                      rows={4}
                      style={{ background: "#fff" }}
                      defaultValue={""}
                    />
                    <label className="form-label" htmlFor="textAreaExample">
                      Message
                    </label>
                  </div>
                </div>
                <div className="float-end mt-2 pt-1">
                  <button type="button" className="btn btn-primary btn-sm">
                    Post comment
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div> */}
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
