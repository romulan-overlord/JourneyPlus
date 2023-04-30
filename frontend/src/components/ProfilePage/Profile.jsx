import React, { useEffect, useState } from "react";
import { expressIP } from "../../settings";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import People from "@mui/icons-material/People";
import { Avatar } from "@mui/material";
import $ from "jquery";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PasswordStrengthBar from "react-password-strength-bar";

function Profile(props) {
  const [isEdited, setIsEdited] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [callFetch, setCallFetch] = useState(true);
  const [validUsername, setValidUsername] = useState("");
  const [validEmail, setValidEmail] = useState("");
  const [file, setFile] = useState(props.currentUser.picture);
  const [IsDeletePwd, setDeletePwd] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isValidCurrentPwd, setValidCurrentPwd] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isNewPassword, setNewPassword] = useState("");
  const [isConfirmationPwd, setConfirmationPwd] = useState("");
  const [validConfirmationPwd, setValidConfimationPwd] = useState("");
  const [pwdStrength, setpwdStrength] = useState(0);
  const [showImage, setImage] = useState(true);

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 3,
      }}
    />
  );

  useEffect(() => {
    if (callFetch) {
      fetchUsers();
      setCallFetch(false);
    }
  });

   const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
   const handleMouseDownPassword = (event) => {
     event.preventDefault();
   };
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  function invertIsEdited(event) {
    setIsEdited((prev) => {
      return !prev;
    });
  }

  function invertPwd() {
    setDeletePwd((prev) => {
      return !prev;
    });
  }

  function invertCurrentPwd(){
    setValidCurrentPwd((prev) =>{
      return !prev;
    })
  }

  function invertModal() {
    setDeleteModal((prev) => {
      return !prev;
    });
  }

  function invertImage(){
    setImage((prev) =>{
      return !prev;
    })
  }

  function handlePasswordChange(event){
    setCurrentPassword(event.target.value);
  }

  function handleNewPasswordChange(event) {
    if (isConfirmationPwd === "") setNewPassword(event.target.value);
    else {
      setNewPassword(event.target.value);
      if (isConfirmationPwd !== event.target.value) {
        setValidConfimationPwd("invalid");
      } else {
        setValidConfimationPwd("valid");
      }
    }
  }

  function handleConfirmPasswordChange(event) {
    setConfirmationPwd(event.target.value);
    if (event.target.value === "") setValidConfimationPwd("");
    else if (event.target.value === isNewPassword) {
      setValidConfimationPwd("valid");
    } else {
      setValidConfimationPwd("invalid");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      oldUsername: props.currentUser.username,
      newFirstName: data.get("firstName"),
      newLastName: data.get("lastName"),
      // newUsername: data.get("username"),
      email: data.get("email"),
    };
    fetch(expressIP + "/editProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("NewUser: " + data.update);
        props.updateUserDetails(data.update);
        setIsEdited(true);
        setValidEmail("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function fetchUsers() {
    console.log("inside fetch");
    fetch(expressIP + "/fetchUsersForProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: props.currentUser.username,
        email: props.currentUser.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setAllUsers(data.users);
      });
  }

  function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (String(inputText).match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }
  console.log(allUsers);
  // event.target.value === allUsers[i].email &&
  function handleEmailChange(event) {
    if (allUsers.length === 0) {
      if (ValidateEmail(event.target.value) === true) {
        setValidEmail("valid");
      } else if (event.target.value === "") {
        setValidEmail("");
      } else {
        setValidEmail("invalid");
      }
    } else {
      setValidEmail("valid");
      for (let i = 0; i < allUsers.length; i++) {
        if (ValidateEmail(event.target.value) === true) {
          if (event.target.value === allUsers[i].email) {
            setValidEmail("taken");
          }
        } else {
          if (event.target.value === "") {
            setValidEmail("");
          } else {
            setValidEmail("invalid");
          }
        }
      }
    }
  }

  function handlePictureChange(event) {
    console.log(event.target.files);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      props.updatePicture(reader.result);
      fetch(expressIP + "/updatePicture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: props.currentUser.username,
          picture: reader.result,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(showImage === false)
            invertImage();
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  }

  function handleRemoveImage(event){

    event.preventDefault();
    fetch(expressIP + "/removePicture", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: props.currentUser.username
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.message === "success"){
            console.log("picture deleted");
            invertImage();
            props.currentUser.picture='';
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  }

  function handleDeleteClick(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      username: props.currentUser.username,
      password: data.get("deletePassword"),
    };
    fetch(expressIP + "/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "failure") {
          invertPwd();
        } else if (data.success === "success") {
          console.log("data sent to frontend");
          window.$("#exampleModal").modal("hide");
          props.invertLoggedIn();
          props.invertProfilePage();
        }
      });
  }

  function handlePasswordSubmit(event){
    console.log("inside submit");
    event.preventDefault();
    const requestData = {
      username: props.currentUser.username,
      password: currentPassword
    };
    fetch(expressIP + "/checkPasswordForChange", {
       method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "failure") {
          console.log("failure");
          invertCurrentPwd();
        } else if (data.success === "success") {
          console.log("success");
          window.$("#ChangePasswordModal").modal("hide");
          window.$("#ModifyPasswordModal").modal("show");
        }
      });
  }

  function handleModifyPassword(event){
    event.preventDefault();
    const requestData = {
      username: props.currentUser.username,
      modifiedPwd: isNewPassword,
    };
    fetch(expressIP + "/modifyPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "modificationSuccess") {
          console.log("reset Success");
          window.$("#ModifyPasswordModal").modal("hide");
        } else if (data.success === "modificationFail") {
          console.log("modification fail");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  $("#myModal").on("shown.bs.modal", function () {
    $("#myInput").trigger("focus");
  });
  console.log(showImage);
  return (
    <div className="row details-container">
      <div className="col-xl-4">
        {/* <!-- Profile picture card--> */}
        <div className="card mb-4 mb-xl-0 card-profile">
          <div className="card-header-profile">Profile Picture</div>
          <div className="card-body text-center">
            {/* <!-- Profile picture image--> */}
            <div>
              <span className="mx-auto profile-picture">
                <Avatar
                  src={showImage ? props.currentUser.picture : ""}
                  alt="Picture"
                  sx={{ width: 140, height: 140 }}
                ></Avatar>
              </span>
            </div>
            {/* <img></img> */}
            {/* <!-- Profile picture help block--> */}
            <div className="small font-italic text-muted mb-4"></div>
            {/* <!-- Profile picture upload button--> */}
            {props.selfProfile ? (
              <span>
                <input
                  id="uploadPicture"
                  className="noDisplay"
                  type="file"
                  onChange={handlePictureChange}
                />

                <label className="uploadImage" htmlFor="uploadPicture">
                  Upload Image
                </label>
              </span>
            ) : null}
            {props.currentUser.picture.length !== 0 && showImage ? (
              <button
                onClick={handleRemoveImage}
                type="button"
                className="btn btn-primary remove-image-btn"
              >
                Remove Image
              </button>
            ) : null}

            {/* <h5 className="my-3">
                  {props.currentUser.firstName} {props.currentUser.lastName}
                </h5>
                <p className="text-muted mb-1">{props.currentUser.username}</p>
                <p className="text-muted mb-4">{props.currentUser.email}</p> */}
            <ColoredLine color="gray" />
            <div className="row follow-container">
              <div className="col">
                <People fontSize="large" />
                <br />
                <h5>Followers</h5>
                <h6>{props.currentUser.followers.length}</h6>
              </div>

              <div className="col">
                <PersonAdd fontSize="large" />
                <br />
                <h5>Following</h5>
                <h6>{props.currentUser.following.length}</h6>
              </div>
            </div>
            {props.selfProfile ? (
              <div>
                <div className="mx-auto">
                  <button
                    onClick={props.logOut}
                    type="button"
                    className="btn btn-danger"
                  >
                    Log Out
                  </button>

                  <button
                    //onClick={handleDeleteClick}
                    type="button"
                    className="btn btn-danger mx-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Delete Account
                  </button>

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Kindly Enter Your Password
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={handleDeleteClick} method="POST">
                          <div className="modal-body">
                            {IsDeletePwd ? (
                              <div className="mb-3">
                                <input
                                  // onChange={handleEmailChange}
                                  className="form-control"
                                  name="deletePassword"
                                  id="inputPassword"
                                  type="password"
                                  placeholder="Enter your password"
                                  required
                                ></input>
                              </div>
                            ) : (
                              <div className="mb-3">
                                <input
                                  // onChange={handleEmailChange}
                                  onChange={invertPwd}
                                  className="form-control is-invalid"
                                  aria-describedby="validationServer03Feedback"
                                  name="deletePassword"
                                  id="inputPassword"
                                  type="password"
                                  placeholder="Enter your password"
                                  required
                                ></input>
                                <div className="invalid-feedback">
                                  Invalid Password
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="submit" className="btn btn-danger">
                              Delete
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="col-xl-8 edit-profile-container">
        {/* <!-- Account details card--> */}
        <div className="card mb-4 card-profile">
          <div className="card-header-profile">Profile Details</div>
          <div className="card-body">
            {isEdited ? (
              <div>
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Username</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {props.currentUser.username}
                  </div>
                </div>
                <ColoredLine color="gray" />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">First Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {props.currentUser.firstName}
                  </div>
                </div>
                <ColoredLine color="gray" />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Last Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {props.currentUser.lastName}
                  </div>
                </div>
                <ColoredLine color="gray" />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {props.currentUser.email}
                  </div>
                </div>
                <ColoredLine color="gray" />

                {/* <!-- Save changes button--> */}
                {props.selfProfile ? (
                  <div>
                    <button
                      onClick={invertIsEdited}
                      className="btn btn-primary"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#ChangePasswordModal"
                      type="button"
                      className="btn btn-primary change-password-button"
                    >
                      Change Password
                    </button>
                  </div>
                ) : null}

                <div
                  className="modal fade"
                  id="ChangePasswordModal"
                  aria-labelledby="OTPModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered reset-password-modal">
                    <div className="modal-content text-center">
                      <div className="modal-header h5 text-white bg-primary justify-content-center">
                        Change Password
                      </div>
                      <div className="modal-body px-5">
                        <p className="py-2">Enter your current password</p>
                        {isValidCurrentPwd ? (
                          <div>
                            <input
                              type="password"
                              onChange={handlePasswordChange}
                              placeholder="Enter password"
                              name="password"
                              className="form-control my-3"
                            ></input>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="password"
                              onChange={invertCurrentPwd}
                              placeholder="Enter password"
                              name="password"
                              aria-describedby="validationServer03Feedback"
                              className="form-control my-3 is-invalid"
                            ></input>
                            <div className="invalid-feedback">
                              Invalid Password
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handlePasswordSubmit}
                          className="btn btn-primary w-100"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal fade"
                  id="ModifyPasswordModal"
                  // tabindex="-1"
                  aria-labelledby="ResetModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered reset-password-modal">
                    <div className="modal-content text-center">
                      <div className="modal-header h5 text-white bg-primary justify-content-center">
                        Change Password
                      </div>
                      <div className="modal-body px-5">
                        <div className="form-outline">
                          <p>New Password:</p>
                          <div className="input-group flex-nowrap outline-dark margin-between-input">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className="form-control"
                              onChange={handleNewPasswordChange}
                              placeholder="Enter New Password"
                              aria-label="Password"
                              aria-describedby="addon-wrapping"
                            ></input>
                            <div className="input-group-text">
                              <InputAdornment
                                className="visibility-icon"
                                position="start"
                              >
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowNewPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showNewPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            </div>
                          </div>

                          <PasswordStrengthBar
                            password={isNewPassword}
                            onChangeScore={(score, feedback) => {
                              setpwdStrength(score);
                            }}
                          />
                          <p>Confirm Password:</p>
                          <div className="input-group flex-nowrap outline-dark margin-between-input">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              onChange={handleConfirmPasswordChange}
                              className={
                                validConfirmationPwd === ""
                                  ? "form-control"
                                  : validConfirmationPwd === "valid"
                                  ? "form-control is-valid"
                                  : validConfirmationPwd === "invalid"
                                  ? "form-control is-invalid"
                                  : null
                              }
                            ></input>
                            <div className="input-group-text">
                              <InputAdornment
                                className="visibility-icon"
                                position="start"
                              >
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowConfirmPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            </div>
                          </div>
                          {validConfirmationPwd === "valid" ? (
                            <div className="validPwd">Password Match.</div>
                          ) : validConfirmationPwd === "invalid" ? (
                            <div className="invalidPwd">Password Mismatch.</div>
                          ) : null}
                        </div>

                        {validConfirmationPwd === "" ||
                        validConfirmationPwd === "invalid" ||
                        pwdStrength === 0 ||
                        pwdStrength === 1 ? (
                          <button
                            type="button"
                            disabled
                            className="btn btn-primary w-100"
                          >
                            Change Password
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleModifyPassword}
                            // onClick={handleResetPassword}
                            className="btn btn-primary w-100"
                          >
                            Change Password
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} method="POST">
                {/* <!-- Form Group (username)--> */}
                <div className="mb-3">
                  <label className="small mb-1">
                    <h6>
                      Username (how your name will appear to other users on the
                      site)
                    </h6>
                  </label>
                  <input
                    // onChange={handleUsernameChange}
                    name="username"
                    className="form-control"
                    id="inputUsername"
                    type="text"
                    placeholder={props.currentUser.username}
                    disabled
                    // value={props.currentUser.username}
                  ></input>
                </div>
                {/* <!-- Form Row--> */}
                <div className="row gx-3 mb-3">
                  {/* <!-- Form Group (first name)--> */}
                  <div className=" p-2 col-md-6">
                    <label className="small mb-1">
                      <h6>First name</h6>
                    </label>
                    <input
                      className="form-control"
                      name="firstName"
                      id="inputFirstName"
                      type="text"
                      placeholder="Enter your first name"
                    ></input>
                  </div>
                  {/* <!-- Form Group (last name)--> */}
                  <div className="p-2 col-md-6">
                    <label className="small mb-1">
                      <h6>Last name</h6>
                    </label>
                    <input
                      className="form-control"
                      name="lastName"
                      id="inputLastName"
                      type="text"
                      placeholder="Enter your last name"
                    ></input>
                  </div>
                </div>
                {/* <!-- Form Group (email address)--> */}
                {validEmail === "" ? (
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>Email address</h6>
                    </label>
                    <input
                      onChange={handleEmailChange}
                      className="form-control"
                      name="email"
                      id="inputEmailAddress"
                      type="email"
                      placeholder="Enter your email address"
                    ></input>
                  </div>
                ) : validEmail === "valid" ? (
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>Email address</h6>
                    </label>
                    <input
                      onChange={handleEmailChange}
                      name="email"
                      className="form-control is-valid"
                      id="inputEmailAddress"
                      type="email"
                      placeholder="Enter your email address"
                    ></input>
                    <div className="valid-feedback">Valid Email Address!</div>
                  </div>
                ) : validEmail === "invalid" ? (
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>Email address</h6>
                    </label>
                    <input
                      onChange={handleEmailChange}
                      name="email"
                      className="form-control is-invalid"
                      id="inputEmailAddress"
                      type="email"
                      placeholder="Enter your email address"
                    ></input>
                    <div className="invalid-feedback">
                      Invalid Email Address!
                    </div>
                  </div>
                ) : validEmail === "taken" ? (
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>Email address</h6>
                    </label>
                    <input
                      onChange={handleEmailChange}
                      name="email"
                      className="form-control is-invalid"
                      id="inputEmailAddress"
                      type="email"
                      placeholder="Enter your email address"
                    ></input>
                    <div className="invalid-feedback">Email already taken!</div>
                  </div>
                ) : null}
                {/* <!-- Save changes button--> */}
                {isEdited ? (
                  <button
                    onClick={invertIsEdited}
                    className="btn btn-primary"
                    type="button"
                  >
                    Edit
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={invertIsEdited}
                      className="btn btn-danger profile-cancel-button"
                      type="button"
                    >
                      Cancel
                    </button>
                    {validEmail === "taken" || validEmail === "invalid" ? (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled
                      >
                        Save changes
                      </button>
                    ) : (
                      <button className="btn btn-primary" type="submit">
                        Save changes
                      </button>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
