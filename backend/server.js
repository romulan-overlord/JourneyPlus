const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sizeof = require('object-sizeof');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); //Used to hash passwords
const saltRounds = 10;  //Hashes the password 10 times which further enhances the security

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

// const MediaObj = mongoose.model("mediaObj", mediaObjSchema);

const entrySchema = {
  title: String,
  content: String,
  media: mediaObjSchema,
  backgroundAudio: String,
  backgroundImage: String
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
  console.log("size of post: " + sizeof(req.body));
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
          success: "900", //If both the username and the email is incorrect, it will return an error message
        });
      } else if (!doc) {
        Users.findOne({ username: req.body.username }, async (err, doc) => {
          if (err) throw err;
          if (doc) {
            res.send({
              success: "901", //If the username is already taken, it will return an error message by rendering a different input style for the username
            });
          }
          // console.log("Username already taken");
          else if (!doc) {
            Users.findOne({ email: req.body.email }, async (err, doc) => {
              if (err) throw err;
              if (doc)
                res.send({
                  success: "902", //If the email is incorrect, it will return an error message by rendering a different input style for the email
                });
              else if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);  //the function bcrypt.hash hashes the password entered

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
                  success: "999", //The user has been successfully signed up and saved in the database
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
        if (foundUser) {     //Username has been found in the database
          bcrypt.compare(   //this function compares the entered password with the password saved in the database
            req.body.password,
            foundUser.password,
            function (err, result) {
              if (result === true) {  //the typed in password and the password saved in the database matches
                foundUser.cookieID = req.body.cookieID; //The user is assigned a cookie
                foundUser.save();
                res.send({
                  success: "802", //The user is redirected to the main page
                  user: foundUser,
                });
              } else {
                res.send({
                  success: "801", //The entered password is incorrect
                });
              }
            }
          );
        } else if (!foundUser) {
          res.send({
            success: "800", //The username has not been found in the database
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

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "saivigneshsham@gmail.com",
//     pass: "",
//     clientId:
//       "",
//     clientSocket: "",
//     refreshToken:
//       "",
//   },
// });

// const mailOptions = {
//   from: "saivigneshsham@gmail.com",
//   to: "saivigneshsham@gmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email was sent succussfully");
//   }
// });

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
