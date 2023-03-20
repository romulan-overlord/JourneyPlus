import React, { useEffect, useState } from "react";
import { expressIP } from "../../settings";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import People from "@mui/icons-material/People";
import { Avatar } from "@mui/material";

function Profile(props) {
  const [isEdited, setIsEdited] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [callFetch, setCallFetch] = useState(true);
  const [validUsername, setValidUsername] = useState("");
  const [validEmail, setValidEmail] = useState("");
  const [file, setFile] = useState(props.currentUser.picture);

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

  function invertIsEdited(event) {
    setIsEdited((prev) => {
      return !prev;
    });
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function fetchUsers() {
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
        console.log(data);
        setAllUsers(data.users);
      });
  }

  // function handleUsernameChange(event) {
  //   // console.log(event.target.value);
  //   for (let i = 0; i < allUsers.length; i++) {
  //     // console.log("checking against: " + allUsers[i].username);
  //     // console.log(event.target.value === allUsers[i].username);
  //     if (event.target.value === allUsers[i].username) {
  //       setValidUsername("invalid");
  //       return;
  //     } else if (event.target.value !== allUsers[i].username) {
  //       setValidUsername("valid");
  //     }
  //     if (event.target.value === "") {
  //       setValidUsername("");
  //     }
  //   }
  // }

  function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }
  // event.target.value === allUsers[i].email &&
  function handleEmailChange(event) {
    for (let i = 0; i < allUsers.length; i++) {
      if (ValidateEmail(event.target.value) === true) {
        if (event.target.value === allUsers[i].email) {
          setValidEmail("taken");
        } else {
          setValidEmail("valid");
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

  function handlePictureChange(event) {
    console.log(event.target.files);
    const pic = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      props.updatePicture(reader.result);
      fetch(expressIP + "/updatePicture", {
        method: "POST", // or 'PUT'
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
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    // setFile(URL.createObjectURL(e.target.files[0]));
  }

  // console.log(file.Filelist[0].File.name);

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
                  src={props.currentUser.picture}
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
              <button
                onClick={props.logOut}
                type="button"
                className="btn btn-danger"
              >
                Log Out
              </button>
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
                {isEdited ? (
                  <button
                    onClick={invertIsEdited}
                    className="btn btn-primary"
                    type="button"
                  >
                    Edit
                  </button>
                ) : (
                  <button className="btn btn-primary" type="button">
                    Save changes
                  </button>
                )}
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
                {/* {validUsername === "" ? (
                  
                // ) : validUsername === "valid" ? (
                //   <div className="mb-3">
                //     <label className="small mb-1">
                //       <h6>
                //         Username (how your name will appear to other users on
                //         the site)
                //       </h6>
                //     </label>
                //     <input
                //       onChange={handleUsernameChange}
                //       name="username"
                //       className="form-control is-valid"
                //       id="inputUsername"
                //       type="text"
                //       placeholder="Enter your username"
                //       // value={props.currentUser.username}
                //       //   value="username"
                //     ></input>
                //     <div className="valid-feedback">Valid Username!</div>
                //   </div>
                // ) : validUsername === "invalid" ? (
                //   <div className="mb-3">
                //     <label className="small mb-1">
                //       <h6>
                //         Username (how your name will appear to other users on
                //         the site)
                //       </h6>
                //     </label>
                //     <input
                //       onChange={handleUsernameChange}
                //       name="username"
                //       className="form-control is-invalid"
                //       id="inputUsername"
                //       type="text"
                //       placeholder="Enter your username"
                //       // value={props.currentUser.username}
                //       //   value="username"
                //     ></input>
                //     <div className="invalid-feedback">
                //       Username already exists!
                //     </div>
                //   </div>
                // ) : null} */}

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
                    <div class="valid-feedback">Valid Email Address!</div>
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
              // {followers ? () : ()}
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
