const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/ProjectDB");

console.log("we running");

const TextSchema = new mongoose.Schema({
  entryID: String,
  content: String,
});

const TextModel = mongoose.model("Text", TextSchema);

io.on("connection", (socket) => {
  console.log("a user connected");
  const documentId = socket.handshake.query.documentId;
  console.log("new connection for document: " + documentId);
  TextModel.findOne({ entryID: documentId }, (err, result) => {
    if (err) throw err;
    if (!result) {
      TextModel.create({
        entryID: documentId,
        content: "",
      });
    }
  });

  // Handle incoming messages from the client
  socket.on(documentId, (data) => {
    console.log("received entryID:", data);
    TextModel.findOne({ entryID: documentId }, (err, result) => {
      if (err) throw err;
      if (result) {
        result.content = data.content;
        result.save();
      }
      io.emit(documentId, result.content);
    });
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  console.log("stuff");
  res.send("Hello, world!");
});

server.listen(8888, () => {
  console.log("Server listening on port 8888");
});
