import React, { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";
var Connection = require("sharedb/lib/client").Connection;
import Sharedb from "sharedb/lib/client";
import richText from "rich-text";

Sharedb.types.register(richText.type);

const socket = new WebSocket("ws://127.0.0.1:8080");
var connection = new Connection(socket);

export default function Test(props) {
  const doc = connection.get("documents", props.entryID);
  // const [val, setVal] = useState(null);
  const [isInit, setInit] = useState(true);

  useEffect(() => {
    console.log("in useEffect");
    establishConn();
    setTimeout(500, establishConn);
  }, []);

  function establishConn() {
    fetch("http://192.168.34.130:8080/help", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: props.content,
        entryID: props.entryID,
        message: "how do i do this",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        doc.subscribe((error) => {
          if (error) {
            console.log("connecting to doc broke");
            return console.error(error);
          }
          console.log("trynna set val: " + doc.data);
          // setVal(doc.data);
          const toolbarOptions = [
            "bold",
            "italic",
            "underline",
            "strike",
            "align",
          ];
          const options = {
            theme: "bubble",
            modules: {
              toolbar: toolbarOptions,
            },
          };
          let quill = new Quill("#editor", options);
          quill.setContents(doc.data);
          quill.on("text-change", function (delta, oldDelta, source) {
            if (source !== "user") return;
            doc.submitOp(delta, { source: quill });
          });

          doc.on("op", function (op, source) {
            if (source === quill) return;
            quill.updateContents(op);
          });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return () => {
      connection.close();
    };
  }

  return (
    <>
      <div id="editor">
      </div>
    </>
  );
}
