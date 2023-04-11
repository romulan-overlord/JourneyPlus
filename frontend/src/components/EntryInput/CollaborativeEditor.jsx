import { useState, useEffect } from "react";
import io from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const syncIP = "http://192.168.34.130:3001";

const CollaborativeEditor = (props) => {
  const [editor, setEditor] = useState(null);
  const [content, setContent] = useState("");
  const [socket, setSocket] = useState(null);

  const documentId = props.entryID;

  useEffect(() => {
    // const socket = io('http://192.138.34.130:3001');
    const temp = io(syncIP);
    setSocket(createNewSocket(props.entryID));
    return () => temp.disconnect();
  }, []);

  useEffect(() => {
    const quill = new Quill("#editor", {
      theme: "snow",
    });
    setEditor(quill);
    if (socket) {
      socket.emit("doc:connect", props.entryID);

      socket.on("doc:content", (doc) => {
        setContent(doc.content);
        quill.setContents(doc.content);
      });

      quill.on("text-change", (delta) => {
        const doc = { id: documentId, content: quill.getContents() };
        socket.emit("doc:content", doc);
        setContent(doc.content);
      });
    }
  }, [socket]);

  function createNewSocket(documentId) {
    const newSocket = io(syncIP, { query: { documentId } }); // pass documentId as a query parameter
    return newSocket;
  }

  return <div id="editor" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default CollaborativeEditor;
