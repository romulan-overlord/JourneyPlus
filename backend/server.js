const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/ProjectDB");

const entrySchema = {
  title: String,
  content: String,
};

const Entry = mongoose.model("entry", entrySchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  name: String,
  emailID: String,
  entries: [entrySchema]
});

const Users = mongoose.model("user", userSchema);

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/submit-entry", (req, res) => {
  console.log("post received");
  console.log(req.body);
  res.send({ mesage: "Whyat happens now?" });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
