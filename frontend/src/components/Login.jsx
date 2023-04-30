
import React, { useState } from "react";
import uniqid from "uniqid";
import PasswordStrengthBar from "react-password-strength-bar";
import { expressIP } from "../settings";
import Link from "@mui/material/Link";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login(props) {
  const [IslogUid, setLogUid] = useState(true);
  const [IsPwd, setPwd] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toggleRememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setisValidEmail] = useState(true);
  const [otpInput, setOtpInput] = useState(false);
  const [isValidOTP, setisValidOTP] = useState(true);
  const [otp, setOtp] = useState("");
  const [isNewPassword, setNewPassword] = useState("");
  const [isConfirmationPwd, setConfirmationPwd] = useState("");
  const [validConfirmationPwd, setValidConfimationPwd] = useState("");
  const [pwdStrength, setpwdStrength] = useState(0);

  const handleClickShowLoginPassword = () =>
    setShowLoginPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

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

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handleEmailInputChange() {
    setisValidEmail(true);
  }

  function invertEmail() {
    setisValidEmail((prev) => {
      return !prev;
    });
  }

  function invertOtp() {
    setOtpInput((prev) => {
      return !prev;
    });
  }

  function handleOTPChange(event) {
    setOtp(event.target.value);
  }

  function handleOTPInputChange() {
    setisValidOTP(true);
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

  function handleOTPSubmit(event) {
    event.preventDefault();
    console.log("handling submit");
    const requestData = {
      email: email,
    };
    fetch(expressIP + "/getOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "OTPsuccess") {
          console.log("email sent");
          invertOtp();
        } else if (data.success === "InvalidEmail") {
          invertEmail();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleConfirmOTP(event) {
    event.preventDefault();
    console.log("handling submit");
    const requestData = {
      otp: otp,
    };
    fetch(expressIP + "/confirmOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "OTPmatch") {
          console.log("otp matches");
          window.$("#OTPModal").modal("hide");
          window.$("#ResetModal").modal("show");
        } else if (data.success === "OTPIncorrect") {
          console.log("otp fail");
          setisValidOTP(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleResetPassword(event) {
    event.preventDefault();
    const requestData = {
      email: email,
      resetPwd: isNewPassword,
    };
    fetch(expressIP + "/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "resetSuccess") {
          console.log("reset Success");
          window.$("#ResetModal").modal("hide");
        } else if (data.success === "resetFail") {
          console.log("reset fail");
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
                            spellcheck="false"
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
                            spellcheck="false"
                          ></input>

                          <div className="invalid-feedback">
                            Invalid Username
                          </div>
                        </div>
                      )}
                      <div className="input-group flex-nowrap outline-dark margin-between-input">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          name="password"
                          className={
                            IsPwd ? "form-control" : "form-control is-invalid"
                          }
                          onChange={IsPwd ? null : invertPwd}
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="addon-wrapping"
                          required
                          spellcheck="false"
                        ></input>
                        <div className="input-group-text">
                          <InputAdornment
                            className="visibility-icon"
                            position="start"
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowLoginPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showLoginPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        </div>
                      </div>
                      {IsPwd ? null : (
                        <div className="invalidPwd">Invalid Password</div>
                      )}
                      {/* <div className="margin-between-input">
                          <input
                              onChange={invertPwd}
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="form-control is-invalid"
                              aria-describedby="validationServer03Feedback"
                              required
                            ></input>
                            <span className="input-group-text">
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
                            </span>

                            <div className="invalid-feedback">
                              Invalid Password
                            </div>
                        </div> */}
                    </div>
                    <div className="form-check mb-2 mr-sm-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineFormCheck"
                        onClick={invertRememberMe}
                        spellcheck="false"
                      ></input>
                      <label
                        className="form-check-label"
                        htmlFor="inlineFormCheck"
                      >
                        Remember me
                      </label>
                      <a
                        className="forgot-password"
                        data-bs-toggle="modal"
                        data-bs-target="#OTPModal"
                      >
                        Forgot password?
                      </a>
                    </div>
                    {/* <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              Kindly Enter Your Password
                            </h1>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                            <div class="modal-body">

                                <div className="mb-3">
                                  <input
                                    onChange={handleEmailChange}
                                    className="form-control"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                  ></input>
                                </div>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="button" onClick={handleOTPSubmit} class="btn btn-danger">
                                Send OTP
                              </button>
                            </div>
                        </div>
                      </div>
                    </div> */}

                    {/* OTP Confirmation Modal */}
                    <div
                      className="modal fade"
                      id="OTPModal"
                      // tabindex="-1"
                      aria-labelledby="OTPModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered reset-password-modal">
                        <div className="modal-content text-center">
                          <div className="modal-header h5 text-white bg-primary justify-content-center">
                            Password Reset
                          </div>
                          <div className="modal-body px-5">
                            <p className="py-2">
                              Enter your email address and we'll send you an
                              email with instructions to reset your password.
                            </p>
                            <div className="form-outline">
                              {isValidEmail ? (
                                <div>
                                  <input
                                    type="email"
                                    placeholder="Enter email"
                                    onChange={handleEmailChange}
                                    name="email"
                                    id="typeEmail"
                                    className="form-control my-3"
                                    spellcheck="false"
                                  ></input>
                                </div>
                              ) : (
                                <div>
                                  <input
                                    type="email"
                                    placeholder="Enter email"
                                    onChange={handleEmailInputChange}
                                    name="email"
                                    id="typeEmail"
                                    className="form-control is-invalid my-3"
                                    spellcheck="false"
                                  ></input>

                                  <div className="invalid-feedback">
                                    Invalid Email.
                                  </div>
                                </div>
                              )}

                              {otpInput ? (
                                <div>
                                  <div className="otp-sent">
                                    OTP Successfully Sent.
                                  </div>
                                  {isValidOTP ? (
                                    <div>
                                      <input
                                        type="text"
                                        placeholder="Enter OTP Code"
                                        onChange={handleOTPChange}
                                        name="otp"
                                        className="form-control my-3"
                                        spellcheck="false"
                                      ></input>
                                    </div>
                                  ) : (
                                    <div>
                                      <input
                                        type="text"
                                        placeholder="Enter OTP Code"
                                        onChange={handleOTPInputChange}
                                        name="otp"
                                        className="form-control is-invalid my-3"
                                        spellcheck="false"
                                      ></input>

                                      <div className="invalid-feedback">
                                        Invalid OTP.
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : null}
                            </div>
                            {otpInput ? (
                              <button
                                type="button"
                                onClick={handleConfirmOTP}
                                className="btn btn-success w-100"
                              >
                                Confirm OTP
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleOTPSubmit}
                                className="btn btn-primary w-100"
                              >
                                Send OTP
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Reset Password Modal */}
                    <div
                      className="modal fade"
                      id="ResetModal"
                      // tabindex="-1"
                      aria-labelledby="ResetModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered reset-password-modal">
                        <div className="modal-content text-center">
                          <div className="modal-header h5 text-white bg-primary justify-content-center">
                            Password Reset
                          </div>
                          <div className="modal-body px-5">
                            <div className="form-outline">
                              <p>New password:</p>
                              <div className="input-group flex-nowrap outline-dark margin-between-input">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  className="form-control"
                                  onChange={handleNewPasswordChange}
                                  placeholder="Enter New Password"
                                  aria-label="Password"
                                  aria-describedby="addon-wrapping"
                                  spellcheck="false"
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
                              <p>New password:</p>
                              <div className="input-group flex-nowrap outline-dark margin-between-input">
                                <input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
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
                                  spellcheck="false"
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
                                <div className="invalidPwd">
                                  Password Mismatch.
                                </div>
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
                                Reset Password
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResetPassword}
                                className="btn btn-primary w-100"
                              >
                                Reset Password
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
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
