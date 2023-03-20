import React, { useState } from "react";
import $ from "jquery";
import HeaderForMainPage from "./HeaderForMainPage";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HeaderForProfilePage from "./HeaderForProfilePage";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import { Button } from "@mui/material";
// import MapsUgcIcon from "@mui/icons-material/MapsUgc";
// import Tooltip from "@mui/material/Tooltip";
// import ProfilePage from "./ProfilePage/ProfilePage";

function Header(props) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark" id="header">
      <div className="container-fluid navbar-container mx-lg-5 mx-md-3 py-md-2 py-2 mx-2">
        <a className="navbar-brand" href="">
          Journey
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!props.isLoggedIn ? null : props.profilePage ? (
              <HeaderForProfilePage
                invertProfilePage={props.invertProfilePage}
              />
            ) : (
              <HeaderForMainPage
                invertProfilePage={props.invertProfilePage}
                
                invertCompose={props.invertCompose}
                picture={
                  props.currentUser === undefined
                    ? ""
                    : props.currentUser.picture
                }
                display={props.display}
                setVisibility={props.setVisibility}
              />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
