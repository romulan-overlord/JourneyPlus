import React, {useState} from "react";
import Card from "./Card";
function MainPage(props){
    return (
      <div className="container">
        <div className="row">
          <Card />
          {/* {props.entries.map((entry) => {
            return (
              <div class="card-padding col-lg-4 col-md-6">
                <div class="card border-success mb-3">
                  <div class="card-body text-success">
                    <h5 class="card-title">{entry.title}</h5>
                    <p class="card-text">
                      {entry.content.substring(0,150)}
                    </p>
                    <button
                      class="btn btn-lg btn-block btn-outline-dark align-card-button"
                      type="button"
                    >
                      Read More...
                    </button>
                  </div>
                </div>
              </div>
            );
          })} */}
          <div className="card-padding col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">
                <h3>Header</h3>
              </div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button
                  class="btn btn-lg btn-block btn-outline-dark align-card-button"
                  type="button"
                >
                  Read More...
                </button>
              </div>
            </div>
          </div>
          <div className="card-padding col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">
                <h3>Header</h3>
              </div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button
                  class="btn btn-lg btn-block btn-outline-dark align-card-button"
                  type="button"
                >
                  Read More...
                </button>
              </div>
            </div>
          </div>
          <div className="card-padding col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">
                <h3>Header</h3>
              </div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button
                  class="btn btn-lg btn-block btn-outline-dark align-card-button"
                  type="button"
                >
                  Read More...
                </button>
              </div>
            </div>
          </div>
          <div className="card-padding col-lg-4 col-md-6">
            <div class="card border-success mb-3">
              <div class="card-header">
                <h3>Header</h3>
              </div>
              <div class="card-body text-success">
                <h5 class="card-title">Success card title</h5>
                <p class="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <button
                  class="btn btn-lg btn-block btn-outline-dark align-card-button"
                  type="button"
                >
                  Read More...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );   
}

export default MainPage;