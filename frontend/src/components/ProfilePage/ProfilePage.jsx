import React, { useState } from "react";
import Profile from "./Profile";
import Followers from "./Followers";
import Following from "./Following";
import Loading from "./Loading";
import Users from "./Users";

function ProfilePage(props) {
  const [isProfile, setIsProfile] = useState(true);
  const [isFollowers, setFollowers] = useState(false);
  const [isFollowing, setFollowing] = useState(false);
  const [isUsers, setUsers] = useState(false);

  function openProfile(event) {
    setIsProfile(true);
    setFollowers(false);
    setFollowing(false);
  }

  function openFollowers(event) {
    setIsProfile(false);
    setFollowers(true);
    setFollowing(false);
  }

  function openFollowing(event) {
    setIsProfile(false);
    setFollowers(false);
    setFollowing(true);
  }

  function invertUsers(event) {
    setUsers((prev) => {
      return !prev;
    });
  }
  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 3,
      }}
    />
  );

  return (
    <div className="container-xl px-4 mt-4">
      <nav className="nav nav-borders">
        <a
          className={isProfile ? "nav-link active" : "nav-link"}
          href="#"
          onClick={openProfile}
        >
          Profile
        </a>
        <a
          className={isFollowers ? "nav-link active" : "nav-link"}
          href="#"
          onClick={openFollowers}
        >
          Followers
        </a>
        <a
          className={isFollowing ? "nav-link active" : "nav-link"}
          href="#"
          onClick={openFollowing}
        >
          Following
        </a>
      </nav>
      <hr className="mt-0 mb-4"></hr>
      {isProfile ? (
        <Profile updatePicture={props.updatePicture} currentUser={props.currentUser} logOut={props.logOut} />
      ) : null}
      {isFollowers ? (
        <Followers
          currentUser={{
            username: props.currentUser.username,
            cookieID: props.currentUser.cookieID,
            following: props.currentUser.following,
            followers: props.currentUser.followers,
          }}
          updateNetwork={props.updateNetwork}
        />
      ) : null}
      {isFollowing ? (
        isUsers ? (
          <Users
            invertUsers={invertUsers}
            currentUser={{
              username: props.currentUser.username,
              cookieID: props.currentUser.cookieID,
              following: props.currentUser.following,
              followers: props.currentUser.followers,
            }}
            updateNetwork={props.updateNetwork}
          />
        ) : (
          <Following
            invertUsers={invertUsers}
            currentUser={{
              username: props.currentUser.username,
              cookieID: props.currentUser.cookieID,
              following: props.currentUser.following,
              followers: props.currentUser.followers,
            }}
            updateNetwork={props.updateNetwork}
          />
        )
      ) : null}
    </div>
  );
}

export default ProfilePage;
