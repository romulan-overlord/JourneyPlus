var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var WebSocket = require("ws");
var http = require("http");
var ShareDB = require("sharedb");
var WebSocketJSONStream = require("@teamwork/websocket-json-stream");
var richText = require("rich-text");

ShareDB.types.register(richText.type);

var app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

var server = http.createServer(app);
var webSocketServer = new WebSocket.Server({ server: server });

var backend = new ShareDB();
const connection = backend.connect();

app.post("/help", (req, res) => {
  console.log("post received: " + req.body.entryID);
  const doc = connection.get("documents", req.body.entryID);
  doc.fetch((err) => {
    console.log("fetch received");
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{ insert: req.body.content }], "rich-text", () => {
        console.log("document created");
        webSocketServer.on("connection", (webSocket) => {
          var stream = new WebSocketJSONStream(webSocket);
          backend.listen(stream);
        });
      });
      return;
    }
  });
  res.send({ server: "somwthing happened" });
});

server.listen(8080, () => {
  // cleanup();
  console.log(`CollabServer is running on port 8888.`);
});
