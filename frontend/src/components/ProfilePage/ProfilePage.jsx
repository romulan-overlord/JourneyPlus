import React, {useState} from "react";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import People from "@mui/icons-material/People";
import { expressIP } from "../../settings";

function ProfilePage(props){
  // const[editProfile, setEditProfile] = useState("true");
  // const[followers, setFollowers] = useState("false");
  // function invertFollowers(event){
  //   setFollowers((prev) =>{
  //     return !prev;
  //   })
  // }
  const [isEdited, setIsEdited] = useState("true");
  function invertIsEdited(event) {
    setIsEdited((prev) => {
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

  function fetchUsers(){
    fetch(expressIP + "/fetchUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
  }

  return (
    <div className="container-xl px-4 mt-4">
      <nav className="nav nav-borders">
        <a className="nav-link active ms-0" href="" target="__blank">
          Profile
        </a>
        <a className="nav-link" href="" target="__blank">
          Followers & Following List
        </a>
      </nav>
      <hr className="mt-0 mb-4"></hr>
      <div className="row details-container">
        <div className="col-xl-4">
          {/* <!-- Profile picture card--> */}
          <div className="card mb-4 mb-xl-0 card-profile">
            <div className="card-header-profile">Profile Picture</div>
            <div className="card-body text-center">
              {/* <!-- Profile picture image--> */}
              <img
                className="img-account-profile rounded-circle mb-2"
                src="http://bootdey.com/img/Content/avatar/avatar1.png"
                alt=""
              ></img>
              {/* <!-- Profile picture help block--> */}
              <div className="small font-italic text-muted mb-4"></div>
              {/* <!-- Profile picture upload button--> */}
              <button className="btn btn-primary" type="button">
                Upload new image
              </button>
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
                  <h6>30</h6>
                </div>

                <div className="col">
                  <PersonAdd fontSize="large" />
                  <br />
                  <h5>Following</h5>
                  <h6>30</h6>
                </div>
              </div>
              <button
                onClick={props.logOut}
                type="button"
                className="btn btn-danger"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-8 edit-profile-container">
          {/* <!-- Account details card--> */}
          <div className="card mb-4 card-profile">
            <div className="card-header-profile">Profile Details</div>
            <div className="card-body">
              {isEdited ? (
                <form>
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
                </form>
              ) : (
                <form>
                  {/* <!-- Form Group (username)--> */}
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>
                        Username (how your name will appear to other users on
                        the site)
                      </h6>
                    </label>
                    <input
                      className="form-control"
                      id="inputUsername"
                      type="text"
                      placeholder="Enter your username"
                      value={props.currentUser.username}
                      //   value="username"
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
                        id="inputFirstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={props.currentUser.firstName}
                        //value="Valerie"
                      ></input>
                    </div>
                    {/* <!-- Form Group (last name)--> */}
                    <div className="p-2 col-md-6">
                      <label className="small mb-1">
                        <h6>Last name</h6>
                      </label>
                      <input
                        className="form-control"
                        id="inputLastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={props.currentUser.lastName}
                        //value="Luna"
                      ></input>
                    </div>
                  </div>
                  {/* <!-- Form Group (email address)--> */}
                  <div className="mb-3">
                    <label className="small mb-1">
                      <h6>Email address</h6>
                    </label>
                    <input
                      className="form-control"
                      id="inputEmailAddress"
                      type="email"
                      placeholder="Enter your email address"
                      value={props.currentUser.email}
                    ></input>
                  </div>
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
                      <button
                        onClick={invertIsEdited}
                        className="btn btn-primary"
                        type="button"
                      >
                        Save changes
                      </button>
                    </div>
                  )}
                </form>
                // {followers ? () : ()}
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;