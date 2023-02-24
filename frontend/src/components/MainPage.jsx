import React, { useState, useEffect } from "react";

function MainPage(props) {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    setUserReady(true);
  });

  return (
    <div className="container card-adding">
      <div className="row">
        {userReady
          ? props.currentUser.entries.map((entry) => {
              return (
                <div class="col-lg-4 col-md-6">
                  <div class="card border-success mb-3">
                    <div class="card-header">Hell yeah!!!!!!</div>
                    <div class="card-body text-success">
                      <h5 class="card-title">Success card title</h5>
                      <p class="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
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
