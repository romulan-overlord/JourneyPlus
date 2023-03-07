import React, { useState } from "react";
import $ from "jquery";

import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import Tooltip from "@mui/material/Tooltip";
import ProfilePage from "./ProfilePage/ProfilePage";

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
            <table className="width-100">
              <tbody>
                <tr>
                  <td className="table_data">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={props.invertCompose}
                    >
                      Compose
                    </button>
                  </td>
                  <td className="table_data">
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        {props.private ? "Private" : "Public"}
                      </a>
                      <ul className="dropdown-menu">
                        <li
                          onClick={() => {
                            props.setVisibility(true);
                          }}
                        >
                          <a className="dropdown-item" href="#">
                            Private
                          </a>
                        </li>
                        <li
                          onClick={() => {
                            props.setVisibility(false);
                          }}
                        >
                          <a className="dropdown-item" href="#">
                            Public
                          </a>
                        </li>
                      </ul>
                    </li>
                  </td>
                  <td>
                    <a className="nav-link" href="#">
                      <Avatar onClick={props.invertProfilePage}>
                        {/* props.logOut  */}
                        <PersonIcon />
                      </Avatar>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
