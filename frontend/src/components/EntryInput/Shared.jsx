import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import debounce from 'lodash/debounce';

const syncIP = "http://192.168.34.130:8888";

export default function Shared(props) {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState("");
  const [control, setControl] = useState(true);

  function createNewSocket(documentId) {
    const newSocket = io(syncIP, { query: { documentId } }); // pass documentId as a query parameter
    return newSocket;
  }

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

  useEffect(() => {
    if(socket !== null){
      socket.on(props.entryID, debounce((data) => {
        // console.log('Received update:', data);
        setContent(data);
      }, 1));
      return () => {
        socket.off(props.entryID);
      };
    }
  }, [props.entryID, socket]);

 

  // Listen for incoming messages from the server
  if (socket !== null) {
    // socket.on(props.entryID, (data) => {
    //   if (control) {
    //     console.log("received message of update:", data);
    //     setControl(false);
    //     setContent(data);
    //   }
    // });

    function handleChange(event) {
      // console.log("handling change");
      setControl(true);
      socket.emit(props.entryID, {
        entryID: props.entryID,
        content: event.target.value,
      });
      props.updateContent(content);
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
