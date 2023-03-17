import React, { useState } from "react";
import { Avatar } from "@mui/material";

export default function HeaderForMainPage(props){
    return (
      <div>
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
                    {props.display}
                  </a>
                  <ul className="dropdown-menu">
                    <li
                      onClick={() => {
                        props.setVisibility("Private");
                      }}
                    >
                      <a className="dropdown-item" href="#">
                        Private
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        props.setVisibility("Public");
                      }}
                    >
                      <a className="dropdown-item" href="#">
                        Public
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        props.setVisibility("Feed");
                      }}
                    >
                      <a className="dropdown-item" href="#">
                        Feed
                      </a>
                    </li>
                  </ul>
                </li>
              </td>
              <td>
                <a className="nav-link" href="#">
                  <Avatar src={props.picture} onClick={props.invertProfilePage}>
                    {/* props.logOut  */}
                    {/* <PersonIcon /> */}
                  </Avatar>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
}