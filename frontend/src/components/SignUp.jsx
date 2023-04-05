import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import React, { useState } from "react";
import Link from "@mui/material/Link";
import PasswordStrengthBar from "react-password-strength-bar";
import { expressIP } from "../settings";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function SignUp(props) {
  const [isUID, setUid] = useState(true);
  const [isEmail, setEmail] = useState(true);
  const [Pwd, setPwd] = useState("");
  const [pwdStrength, setpwdStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function invertUid() {
    setUid((prev) => {
      return !prev;
    });
  }

  function invertEmail() {
    setEmail((prev) => {
      return !prev;
    });
  }

  function handleChange(event) {
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
      picture: "",
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
          window.$("#SignedUpModal").modal("show");
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

                          <div className="invalid-feedback">
                            Email already taken.
                          </div>
                        </div>
                      )}
                      <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                        <input
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="addon-wrapping"
                          required
                        ></input>
                        <div className="input-group-text">
                          <InputAdornment
                            className="visibility-icon"
                            position="start"
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        </div>
                      </div>
                    </div>
                    <PasswordStrengthBar
                      password={Pwd}
                      onChangeScore={(score, feedback) => {
                        setpwdStrength(score);
                      }}
                      scoreWordStyle={{color: "black"}}
                    />
                    {pwdStrength === 2 ||
                    pwdStrength === 3 ||
                    pwdStrength === 4 ? (
                      <div className="text-center">
                        <button
                          className="button-text btn btn-block btn-outline-dark set-signup-button-colour"
                          type="submit"
                        >
                          Sign Up
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <button
                          className="button-text btn btn-block btn-outline-dark set-signup-button-colour"
                          type="submit"
                          disabled
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
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
      {/* Succesfully Signed in Modal */}
      <div
        class="modal fade"
        id="SignedUpModal"
        aria-labelledby="SignedUpModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                {/* {isPrivate
                  ? "From Private to Public"
                  : "From Public to Private"} */}
              </h1>
            </div>
            <div class="modal-body">Successfully Signed Up</div>
            <div class="modal-footer">
              <button
                type="button"
                onClick={props.invertIsSignedUp}
                data-bs-dismiss="modal"
                class="btn btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
