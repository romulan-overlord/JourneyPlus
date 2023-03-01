import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import React, {useState} from "react";
import { expressIP } from "../settings";
import Link from "@mui/material/Link";
import PasswordStrengthBar from "react-password-strength-bar";

function SignUp(props) {

  const [isUID, setUid] = useState(true);
  const [isEmail, setEmail] =useState(true);
  const [Pwd, setPwd] = useState("");
  console.log(Pwd);
  function invertUid() {
    setUid((prev) => {
      return !prev;
    });
  }

  function invertEmail(){
    setEmail((prev) => {
      return !prev;
    });
  }

  function handleChange(event){
    setPwd(event.target.value);
  }

  // const [flag, setUid] = useState({});
  function handleSubmitSignUp(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };
    fetch(expressIP + "/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "900") {
          invertUid();
          invertEmail();
        } else if (data.success === "901") {
          invertUid();
        } else if (data.success === "902") {
          invertEmail();
        } else if (data.success === "999") {
          props.invertIsSignedUp();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="container-fluid center-div">
      <div className="row mx-lg-5 mx-2">
        <div className="col-md-6">
          <div className="container-fluid px-0 landing-page-title">
            <h1 className="big-heading">Because your Story Matters...</h1>
            <h3 className="sub-text">
              Record your journey as you see fit, perhaps share it with the
              world.
            </h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="align-card signup-column col-lg-10 px-md-6">
            <div className="container-fluid px-0 landing-page-title">
              <div className="card set-colour card-border-radius">
                <div className="mx-auto signup-text">
                  <h3 className="card-title signup-text">Sign Up</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmitSignUp} method="POST">
                    <div className="container text-center">
                      <div className="row">
                        <div className="col first-name-button width-50">
                          <div className="input-group flex-nowrap margin-between-input">
                            <input
                              type="text"
                              name="firstName"
                              className="form-control "
                              placeholder="First Name"
                              aria-label="First Name"
                              aria-describedby="addon-wrapping"
                              required
                            ></input>
                          </div>
                        </div>
                        <div className="col last-name-button width-50">
                          <div className="input-group flex-nowrap margin-between-input">
                            <input
                              type="text"
                              name="lastName"
                              className="form-control "
                              placeholder="Last Name"
                              aria-label="Last Name"
                              aria-describedby="addon-wrapping"
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {isUID ? (
                        <div className="input-text input-group flex-nowrap margin-between-input">
                          <input
                            type="text"
                            name="username"
                            className="form-control "
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="addon-wrapping"
                            required
                          ></input>
                        </div>
                      ) : (
                        <div className="margin-between-input">
                          <input
                            onChange={invertUid}
                            type="text"
                            name="username"
                            className="form-control is-invalid"
                            aria-describedby="validationServer03Feedback"
                            required
                          ></input>

                          <div className="invalid-feedback">
                            Username already exists.
                          </div>
                        </div>
                      )}
                      {isEmail ? (
                        <div className="input-group flex-nowrap margin-between-input">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="addon-wrapping"
                            required
                          ></input>
                        </div>
                      ) : (
                        <div className="margin-between-input">
                          <input
                            onChange={invertEmail}
                            type="email"
                            name="email"
                            className="form-control is-invalid"
                            aria-describedby="validationServer03Feedback"
                            required
                          ></input>

                          <div class="invalid-feedback">
                            Email already taken.
                          </div>
                        </div>
                      )}
                      <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                        <input
                          onChange={handleChange}
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="addon-wrapping"
                          required
                        ></input>
                      </div>
                    </div>
                    <PasswordStrengthBar
                      password={Pwd}
                      
                    />
                    <div className="text-center">
                      <button
                        className="button-text btn btn-block btn-outline-dark set-signup-button-colour"
                        type="submit"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>

                  <div className="text-center">
                    <p className="account-text">
                      Already have an account?{" "}
                      <Link onClick={props.switch} href="#" variant="body2">
                        {"Login"}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
