import React, { useState, useEffect } from "react";
import _, { remove } from "lodash";

let count = 0;

export default function SharedEntry(props) {
  const [content, setContent] = useState("");
  const [arr, setArr] = useState([]);
  const [buffer, setBuffer] = useState({ buffer: "", cursor: 0 });

  useEffect(updateContent, [buffer]);

  function isEqual(ob1, ob2) {
    if (
      ob1.value === ob2.value &&
      ob1.index.position === ob2.index.position &&
      ob1.index.site === ob2.index.site
    ) {
      return true;
    } else return false;
  }

  function removeDuplicates(list) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        // console.log(_.isEqual(arr[i], arr[j]));
        if (isEqual(list[i], list[j])) {
          // console.log("removing: " + list[j].value);
          list.splice(j, 1);
        }
      }
    }
    // console.log("returning: " + list);
    return list;
  }

  function handleTextChange(event) {
    let text = event.target.value;
    setContent(event.target.value);
    setArr((prev) => {
      let temp = prev;
      temp.push({
        value: text[text.length - 1],
        index: {
          position: count,
          site: props.currentUser.username,
        },
      });
      return temp;
    });
    count++;
  }

  function handleBufferChange(event) {
    // console.log(event.target.selectionStart);
    setBuffer((prev) => {
      return {
        buffer: event.target.value,
        cursor: event.target.selectionStart,
      };
    });
  }

  function updateContent() {
    console.log(content + "<- updating content: " + buffer.buffer);
    let diff = buffer.buffer.length - content.length;
    let start = buffer.cursor - diff;
    console.log(start + "  help  " + diff);
    setContent((prev) => {
      return prev + buffer.buffer.substring(start, start+diff);
    });
    for (let i = start; i < diff; i++) {
      setArr((prev) => {
        let temp = prev;
        temp.push({
          value: buffer.buffer[i],
          index: {
            position: count,
            site: props.currentUser.username,
          },
        });
        return temp;
      });
      count++;
      setArr((prev) => removeDuplicates(prev));
    }
  }

  return (
    <div className="container-fluid">
      <textarea
        rows={10}
        cols={50}
        placeholder="Write your thoughts away..."
        name="content"
        value={content}
      ></textarea>
      <textarea
        rows={10}
        cols={50}
        placeholder="Write your thoughts away..."
        onChange={handleBufferChange}
        name="buffer"
      ></textarea>
    </div>
  );
}
