const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

app.use(session({
  secret: 'my lil secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());    //passport manages the sessions

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/ProjectDB");

const entrySchema = {
  title: String,
  content: String,
  media: [String],
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
  entries: [entrySchema],
});

userSchema.plugin(passportLocalMongoose);   //Used to hash and salt passwords and store users in our mongodb database

const Users = mongoose.model("user", userSchema);

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

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
  Users.register({
    firstName: req.body.firstName, 
    lastName: req.body.lastName, 
    username: req.body.username, 
    email: req.body.email}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      console.log("failure");
    }else{
      passport.authenticate("local")(req, res, function(){
        console.log("success");
      })
    }
  })
  // console.log(req.body);
  // const newUser = new Users({
  //   ...req.body,
  //   entries: [],
  // });
  // newUser.save();
  // res.send({ message: "success" });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

// hey sham
// jhgdjkdjk

