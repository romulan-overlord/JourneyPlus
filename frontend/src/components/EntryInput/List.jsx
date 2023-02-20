import * as React from "react";

function List(props) {
  return (
    <div>
      {props.data.map((file) => {
        return (
          <div>
            <audio id="player" className="audio-player">
              <source src={file} type="audio/mpeg"></source>
              <source src="horse.ogg" type="audio/ogg"></source>
            </audio>
            <div>
              <button onclick={$("#player").play()}>
                Play
              </button>
              <button onclick={$("#player").pause()}>
                Pause
              </button>
              <button onclick="document.getElementById('player').volume += 0.2">
                Vol+
              </button>
              <button onclick="document.getElementById('player').volume -= 0.2">
                Vol-
              </button>
            </div>
            {/* <audio controls className="audio-player">
              <source src={file} type="audio/mpeg"></source>
              <source src="horse.ogg" type="audio/ogg"></source>
            </audio> */}
          </div>
        );
      })}
    </div>
  );
}

export default List;
