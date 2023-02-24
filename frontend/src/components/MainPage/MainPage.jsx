import React, { useState, useEffect } from "react";
import Card from "./Card";

function MainPage(props) {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    setUserReady(true);
  });

  useEffect(() => {
    let windowHeight = 1080;
    let windowWidth = 1920;
      let cardHeight = $("#card").outerHeight();
      let cardWidth = $("#card").outerWidth();
      $("#row").outerHeight(
        (windowHeight / windowWidth) * cardWidth
      );
      console.log("Before resize: " + cardHeight);
  });
  return (
      <div className="container-fluid px-5 row entry-display-container" id="entryRow">
        {userReady
          ? props.currentUser.entries.map((entry, index) => {
              return <Card entry={entry} index={index} />;
            })
          : null}
      </div>
  );
}

export default MainPage;