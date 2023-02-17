import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import * as React from "react";
import Link from "@mui/material/Link";

function Login(props) {
  function handleSubmitLogin(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      username: data.get("username"),
      password: data.get("password"),
    };
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.success === true){
          props.invertLoggedIn();
        console.log("Success:", data);
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

                      <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                        <input
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
