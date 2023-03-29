import React, { useState, useEffect } from "react";

export default function SharedEntry(props) {
  const [content, setContent] = useState(props.content);

  function handleTextChange(event){
    setContent(event.target.value);
  }

  return (
    <div className="container-fluid">
      <textarea
        className="entry-content height-100"
        placeholder="Write your thoughts away..."
        onChange={handleTextChange}
        name="content"
        value={content}
      ></textarea>
    </div>
  );
}
