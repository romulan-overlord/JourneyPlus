import React, { useState } from "react";
import uniqid from "uniqid";
import { expressIP } from "../settings";
import Link from "@mui/material/Link";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login(props) {
  const [IslogUid, setLogUid] = useState(true);
  const [IsPwd, setPwd] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toggleRememberMe, setRememberMe] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function invertLogUid() {
    setLogUid((prev) => {
      return !prev;
    });
  }

  function invertPwd() {
    setPwd((prev) => {
      return !prev;
    });
  }

  function invertRememberMe() {
    setRememberMe((prev) => {
      return !prev;
    });
  }

  function handleSubmitLogin(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      username: data.get("username"),
      password: data.get("password"),
      cookieID: uniqid(),
    };
    fetch(expressIP + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "800") {
          invertLogUid();
          invertPwd();
        } else if (data.success === "801") {
          invertPwd();
        } else if (data.success === "802") {
          props.updateCurrentUser(data.user, toggleRememberMe);
          props.invertLoggedIn();
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
              <div className="card set-colour">
                <div className="mx-auto signup-text">
                  <h3 className="card-title signup-text">Login</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmitLogin} method="POST">
                    <div className="row">
                      {IslogUid ? (
                        <div className="input-text input-group flex-nowrap margin-between-input">
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="addon-wrapping"
                            required
                          ></input>
                        </div>
                      ) : (
                        <div className="margin-between-input">
                          <input
                            onChange={invertLogUid}
                            type="text"
                            name="username"
                            className="form-control is-invalid"
                            aria-describedby="validationServer03Feedback"
                            required
                          ></input>

                          <div className="invalid-feedback">
                            Invalid Username
                          </div>
                        </div>
                      )}

                      {IsPwd ? (
                        <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="addon-wrapping"
                            required
                          ></input>
                          <div class="input-group-text">
                            <InputAdornment className="visibility-icon">
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
                      ) : (
                        <div className="margin-between-input">
                          <input
                            onChange={invertPwd}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control is-invalid"
                            aria-describedby="validationServer03Feedback"
                            required
                          ></input>
                          <div class="input-group-text">
                            <InputAdornment className="visibility-icon">
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

                          <div className="invalid-feedback">
                            Invalid Password
                          </div>
                        </div>
                      )}
                    </div>
                    <div class="form-check mb-2 mr-sm-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="inlineFormCheck"
                        onClick={invertRememberMe}
                      ></input>
                      <label className="form-check-label" for="inlineFormCheck">
                        Remember me
                      </label>
                    </div>
                    <div className="text-center">
                      <button
                        className="button-text btn btn-block btn-outline-dark set-signup-button-colour"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  <div className="text-center">
                    <p className="account-text">
                      Don't have an account?{" "}
                      <Link onClick={props.switch} href="#" variant="body2">
                        {"Sign Up"}
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

export default Login;
