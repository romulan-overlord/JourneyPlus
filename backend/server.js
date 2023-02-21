const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const cookieParser = require("cookie-parser");
// const localStrategy = require("passport-local");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// app.use(session({
//   secret: 'my lil secret',
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(cookieParser("my lil secret"));
// app.use(passport.initialize());
// app.use(passport.session());    //passport manages the sessions

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

//userSchema.plugin(passportLocalMongoose);   //Used to hash and salt passwords and store users in our mongodb database

const Users = mongoose.model("user", userSchema);

// passport.use(Users.createStrategy());
// passport.serializeUser(Users.serializeUser((user, cb) => {
//   cb(null, user.id);
// }));

// passport.deserializeUser(Users.deserializeUser((id, cb) => {

// }));

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
  res.send({ mesage: "What happens now?" });
});

app.post("/signUp", (req, res) => {
  Users.findOne({username: req.body.username, email: req.body.email}, async(err, doc) => {
    if(err)
      throw err;
      if(doc){
        res.send({
          success: "900"
        });
      }
      else if(!doc){
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
  })   
})
  // console.log(req.body);
  // Users.register({
  //   firstName: req.body.firstName, 
  //   lastName: req.body.lastName, 
  //   username: req.body.username, 
  //   email: req.body.email}, req.body.password, function(err, user){
  //   if(err){
  //     console.log(err);
  //     console.log("failure");
  //   }else{
  //     passport.authenticate("local")(req, res, function(){
  //       console.log("success");
  //     })
  //   }
  // })
  // console.log(req.body);
  // const newUser = new Users({
  //   ...req.body,
  //   entries: [],
  // });
  // newUser.save();
  // res.send({ message: "success" });


app.post("/login", (req, res)=>{
  Users.findOne({ 
    username: req.body.username, 
   }, async (err, foundUser) => {
      if (err) 
        throw err;
      else{
        if(foundUser){
          bcrypt.compare(req.body.password, foundUser.password, function(err, result){
            if(result === true){
              res.send({
                success: "802",
                user: foundUser
              });
            }
            else{
              res.send({
                success: "801"
              });
            }
          });
        }
        else if(!foundUser){
          res.send({
            success: "800"
          });
        }
      }
    });
  // passport.authenticate("local", (err, user, info) => {
  //   if (err) throw err;
  //   if (!user) res.send("No User Exists");
  //   else {
  //     req.logIn(user, (err) => {
  //       if (err) throw err;
  //       res.send("Successfully Authenticated");
  //       console.log(req.user);
  //     });
  //   }
  // })(req, res, next);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

