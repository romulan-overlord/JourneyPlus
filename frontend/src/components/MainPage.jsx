import React, {useState} from "react";

function MainPage(){
    return (
      <div className="container card-adding">
        <div className="row">
          <div class="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
            {/* <div class="card">
              <div class="card-header">
                <h3>Chihuahua</h3>
              </div>
              <div class="card-body">
                <h2 class="price-text">Free</h2>
                <p>5 Matches Per Day</p>
                <p>10 Messages Per Day</p>
                <p>Unlimited App Usage</p>
                <button class="btn btn-lg btn-block btn-outline-dark" type="button">Sign Up</button>
              </div>
            </div> */}
          </div>
          <div className="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">Header</div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );   
}

export default MainPage;