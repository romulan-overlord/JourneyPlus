import React, { useState } from "react";
import Profile from "./Profile";
import Followers from "./Followers";
import Following from "./Following";
import Loading from "./Loading";
import Users from "./Users";
import UserFeed from "./UserFeed";

function ProfilePage(props) {
  const [isProfile, setIsProfile] = useState(true);
  const [isFollowers, setFollowers] = useState(false);
  const [isFollowing, setFollowing] = useState(false);
  const [isPosts, setPosts] = useState(false);
  const [isUsers, setUsers] = useState(false);

  function openProfile(event) {
    setIsProfile(true);
    setFollowers(false);
    setFollowing(false);
    setPosts(false);
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

  function openPosts(event) {
    setIsProfile(false);
    setFollowers(false);
    setFollowing(false);
    setPosts(true);
  }

  function invertUsers(event) {
    setUsers((prev) => {
      return !prev;
    });
  }

  function getForeignUser(user){
    openProfile();
    props.getForeignUser(user);
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
        {props.selfProfile ? (
          <>
            {" "}
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
          </>
        ) : (
          <a
            className={isPosts ? "nav-link active" : "nav-link"}
            href="#"
            onClick={openPosts}
          >
            Posts
          </a>
        )}
      </nav>
      <hr className="mt-0 mb-4"></hr>
      {isProfile ? (
        <Profile
          invertIsSignedUp={props.invertIsSignedUp}
          invertProfilePage={props.invertProfilePage}
          updateUserDetails={props.updateUserDetails}
          updatePicture={props.updatePicture}
          currentUser={
            props.selfProfile ? props.currentUser : props.foreignUser
          }
          logOut={props.logOut}
          selfProfile={props.selfProfile}
        />
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
          getForeignUser={getForeignUser}
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
            getForeignUser={getForeignUser}
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
            getForeignUser={getForeignUser}
          />
        )
      ) : null}
      {isPosts ? (
        <UserFeed
          foreignUser={props.foreignUser}
          currentUser={props.currentUser}
          openEntry={props.openEntry}
          getForeignUser={props.getForeignUser}
          openProfile={openProfile}
        />
      ) : null}
    </div>
  );
}

export default ProfilePage;
