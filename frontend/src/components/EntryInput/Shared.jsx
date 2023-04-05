import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const syncIP = "http://192.168.34.130:8888";

export default function Shared(props) {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const temp = io(syncIP);
    setSocket(createNewSocket(props.entryID));
    return () => temp.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for an event from the server using the socket instance
      socket.emit(props.entryID, {
        entryID: props.entryID,
        content: props.content,
      });
    }
  }, [socket]);

  function createNewSocket(documentId) {
    const newSocket = io(syncIP, { query: { documentId } }); // pass documentId as a query parameter
    return newSocket;
  }

  // Listen for incoming messages from the server
  if (socket !== null) {

    socket.on(props.entryID, (data) => {
      // console.log("received message of update:", data);
      setContent(data);
    });

    function handleChange(event) {
      socket.emit(props.entryID, {
        entryID: props.entryID,
        content: event.target.value,
      });
    }

    return (
      <textarea
        className="entry-content height-100"
        onChange={handleChange}
        value={content}
        name="content"
      ></textarea>
    );
  }
}

// Send a message to the server
