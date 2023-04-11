const ShareDB = require("sharedb");
const shareDBMongo = require("sharedb-mongo");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { type } = require("rich-text");
const { Text } = require("rich-text");
const otText = require("ot-text");

mongoose.set('strictQuery', false);

const db = mongoose.connect("mongodb://localhost:27017/ProjectDB", {
  useNewUrlParser: true,
});

const shareDBMongoURI = "mongodb://localhost:27017/ProjectDB";
const shareDBMongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const shareDBMongoBackend = shareDBMongo(shareDBMongoURI, shareDBMongoOptions);

const shareDB = new ShareDB({ db: shareDBMongoBackend });

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

const documentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, default: "" },
  content: {
    type: String,
    default: "",
    get: (v) => otText.fromJSON(v),
    set: (v) => otText.toJSON(v),
  },
  type: { type: String, default: "text" },
});

const Document = mongoose.model("Document", documentSchema);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", function (socket) {
  console.log("a user connected");
  const documentId = socket.handshake.query.documentId;
  console.log("new connection for document: " + documentId);
  let docId;
  socket.on("subscribe", function (id) {
    docId = id;
    const doc = shareDB.get("documents", docId);
    doc.fetch(function (err) {
      if (err) {
        throw err;
      }
      if (doc.type === null) {
        doc.create("", "text");
        return;
      }
      socket.emit("content", doc.data.content);
    });
    socket.join(docId);
  });

  socket.on("disconnect", function () {
    socket.leave(docId);
  });

  socket.on("op", function (op) {
    const doc = shareDB.get("documents", docId);
    doc.submitOp(op);
    io.to(docId).emit("op", op);
  });
});

app.get("/api/document", async (req, res) => {
  const id = req.query.id;
  const document = await Document.findById(id);
  res.json(document);
});

app.post("/api/document", async (req, res) => {
  const document = new Document({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    content: "",
    type: req.body.type || "text",
  });
  await document.save();
  res.json(document);
});

app.listen(3001, () => {
  console.log("up and running @ 3001");
});
