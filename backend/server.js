const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/ProjectDB");

const entrySchema = {
  title: String,
  content: String,
};

const Entry = mongoose.model("entry", entrySchema);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: {
    type: String,
    required: [true],
  },
  username: String,
  email: String,
  entries: [entrySchema],
});

const Users = mongoose.model("user", userSchema);

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/submit-entry", (req, res) => {
  console.log("post received");
  console.log(req.body);
  const newEntry = new Entry(req.body);
  const user = Users.findOne(
    { username: "romulan" },
    function (err, results) {
      if (!err) {
        if (results) {
          results.entries.push(newEntry);
          results.save();
        }
      }
    }
  );
  res.send({ mesage: "Whyat happens now?" });
});

app.post("/signUp", (req, res) => {
  console.log(req.body);
  const newUser = new Users({
    ...req.body,
    entries: [],
  });
  newUser.save();
  res.send({ message: "success" });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

// hey
