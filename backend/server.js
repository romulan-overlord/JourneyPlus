const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

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

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/ProjectDB");

const mediaObjSchema = {
  image: [String],
  video: [String],
  audio: [String]
}

const MediaObj = mongoose.model("mediaObj", mediaObjSchema);

const entrySchema = {
  title: String,
  content: String,
  media: mediaObjSchema,
  backgroundAudio: String
};

const Entry = mongoose.model("entry", entrySchema);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: {
    type: String,
  },
  username: String,
  email: String,
  cookieID: String,
  entries: [entrySchema],
});

const Users = mongoose.model("user", userSchema);

app.get("/message", (req, res) => {
  res.send("hello fren");
});

app.post("/submit-entry", (req, res) => {
  console.log("post received");
  console.log(req.body);
  const newEntry = new Entry(req.body.entry);
  const user = Users.findOne({ username: req.body.user }, function (err, results) {
    if (!err) {
      if (results) {
        results.entries.push(newEntry);
        results.save();
      }
    }
  });
  res.send({ mesage: "success" });
});

app.post("/signUp", (req, res) => {

  Users.findOne(
    { username: req.body.username, email: req.body.email },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.send({
          success: "900",
        });
      } else if (!doc) {
        Users.findOne({ username: req.body.username }, async (err, doc) => {
          if (err) throw err;
          if (doc) {
            res.send({
              success: "901",
            });
          }
          // console.log("Username already taken");
          else if (!doc) {
            Users.findOne({ email: req.body.email }, async (err, doc) => {
              if (err) throw err;
              if (doc)
                res.send({
                  success: "902",
                });
              // console.log("Email already taken");
              else if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                const newUser = new Users({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  username: req.body.username,
                  cookieID: "",
                  email: req.body.email,
                  password: hashedPassword,
                });
                await newUser.save();
                console.log("User Created");
                res.send({
                  success: "999",
                });
              }
            });
          }
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  console.log(req.body);
  Users.findOne(
    {
      username: req.body.username,
    },
    async (err, foundUser) => {
      if (err) throw err;
      else {
        if (foundUser) {
          bcrypt.compare(
            req.body.password,
            foundUser.password,
            function (err, result) {
              if (result === true) {
                foundUser.cookieID = req.body.cookieID;
                foundUser.save();
                res.send({
                  success: "802",
                  user: foundUser,
                });
              } else {
                res.send({
                  success: "801",
                });
              }
            }
          );
        } else if (!foundUser) {
          res.send({
            success: "800",
          });
        }
      }
    }
  );
});

app.post("/auto-login", (req, res) => {
  // console.log(req.body);
  Users.findOne(
    {
      username: req.body.username,
    },
    async (err, foundUser) => {
      if (err) throw err;
      else {
        if (foundUser) {
          if (foundUser.cookieID === req.body.cookieID) {
            res.send({
              success: "802",
              user: foundUser,
            });
          }
        } else if (!foundUser) {
          res.send({
            success: "800",
          });
        }
      }
    }
  );
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
