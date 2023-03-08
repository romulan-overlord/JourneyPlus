import React from 'react';
import HashLoader from "react-spinners/HashLoader";

function Loading(){
    return (
      <div className="loading-container">
        <HashLoader
          color={"#FFF"}
          size={70}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
    
}

export default Loading;