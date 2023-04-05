import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const CollaborativeEditor = (props) => {
  const [editor, setEditor] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const socket = io('http://192.138.34.130:3001');
    const quill = new Quill('#editor', {
      theme: 'snow',
      // modules: {
      //   toolbar: [
      //     ['bold', 'italic', 'underline', 'strike'],
      //     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      //     [{ 'indent': '-1' }, { 'indent': '+1' }],
      //     [{ 'align': [] }],
      //     ['link', 'image'],
      //     ['clean']
      //   ]
      // }
    });
    setEditor(quill);

    socket.emit('doc:connect', props.entryID);

    socket.on('doc:content', (doc) => {
      setContent(doc.content);
      quill.setContents(doc.content);
    });

    quill.on('text-change', (delta) => {
      const doc = { id: documentId, content: quill.getContents() };
      socket.emit('doc:content', doc);
      setContent(doc.content);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId]);

  return (
    <div id="editor" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default CollaborativeEditor;
