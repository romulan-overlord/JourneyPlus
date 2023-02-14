import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import * as React from "react";

function SignUp(props) {

  function handleSubmitSignUp(event){
    event.preventDefault();
    //console.log("in handler");
    const data = new FormData(event.currentTarget);
    const requestData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };
    fetch("http://localhost:8000/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        props.switch();
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }

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
          <div className="align-card signup-column col-lg-10 col-md-6">
            <div className="container-fluid px-0 landing-page-title">
                <div className="card set-colour">
                  <div className="mx-auto signup-text">
                    <h3 className="card-title signup-text">Sign Up</h3>
                  </div>
                  <div className="card-body">
                  <form onSubmit={handleSubmitSignUp} method="POST">
                    <div className="container text-center">
                        <div className="row">
                          <div className="col first-name-button">
                            <div className="input-group flex-nowrap margin-between-input">
                              <input type="text" name="firstName" className="form-control " placeholder="First Name" aria-label="First Name" aria-describedby="addon-wrapping"></input>
                            </div>
                          </div>
                          <div className="col last-name-button">
                            <div className="input-group flex-nowrap margin-between-input">
                              <input type="text" name="lastName" className="form-control " placeholder="Last Name" aria-label="Last Name" aria-describedby="addon-wrapping"></input>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="input-text input-group flex-nowrap margin-between-input">
                          <input type="text" name="username" className="form-control " placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"></input>
                        </div>

                        <div className="input-group flex-nowrap margin-between-input">
                          <input type="text" name="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="addon-wrapping"></input>
                        </div>

                        <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                          <input type="text" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping"></input>
                        </div>
                      </div>
                      <div className= "text-center">
                      <button className="button-text btn btn-block btn-outline-dark set-signup-button-colour" type="submit">Sign Up</button>
                      </div>
                  </form>
                    
                      <div className= "text-center">
                        <p className="account-text">Already have an account? <a href="">Login</a></p>        
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
