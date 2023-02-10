import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import * as React from "react";

function SignUp(props) {
  return (
    <div className="container-fluid center-div">
      <div className="row mx-5">
        <div className="col-md-6">
          <div className="container-fluid px-0 landing-page-title">
            <h1 className="big-heading">Because your Story Matters...</h1>
            <h3 className="sub-text">
              Record your journey as you see fit, perhaps share it with the
              world.
            </h3>
          </div>
        </div>
        <div className="col-md-6 px-5">
          <div className="signup-column col-lg-12 col-md-6">
            <div className="container-fluid px-0 landing-page-title">
                <div className="card set-colour">
                  <div className="mx-auto signup-text">
                    <h3 className="card-title signup-text">Sign Up</h3>
                  </div>
                    <div className="card-body">
                      <div class="container text-center">
                        <div class="row">
                          <div class="col first-name-button">
                            <div className="input-group flex-nowrap margin-between-input">
                              <input type="text" className="form-control " placeholder="First Name" aria-label="First Name" aria-describedby="addon-wrapping"></input>
                            </div>
                          </div>
                          <div class="col last-name-button">
                            <div className="input-group flex-nowrap margin-between-input">
                              <input type="text" className="form-control " placeholder="Last Name" aria-label="Last Name" aria-describedby="addon-wrapping"></input>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div className="input-text input-group flex-nowrap margin-between-input">
                          <input type="text" className="form-control " placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"></input>
                        </div>

                        <div className="input-group flex-nowrap margin-between-input">
                          <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="addon-wrapping"></input>
                        </div>

                        <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                          <input type="text" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping"></input>
                        </div>
                      </div>
                      <div className= "text-center">
                      <button className="button-text btn btn-lg btn-block btn-outline-dark set-signup-button-colour" type="button">Sign Up</button>
                      </div>
                      <div className= "text-center">
                        <p>Already have an account?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          {/* <div className="container-fluid px-0">
            <form>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  @
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                />
              </div>
            </form>
            <h1>Because Your Story Matters...</h1>
            <h3 className="text-muted">
              Record your journey as you see fit, perhaps share it with the
              world.
            </h3>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
