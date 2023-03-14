const express = require("express");
const cors = require("cors");
const uniqid = require("uniqid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sizeof = require("object-sizeof");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); //Used to hash passwords
const saltRounds = 10; //Hashes the password 10 times which further enhances the security
const https = require("https");
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
  audio: [String],
};

const mediaWarehouseSchema = {
  id: String,
  data: String,
};

const MediaWarehouse = mongoose.model("mediaWarehouse", mediaWarehouseSchema);

const commentSchema = {
  author: String,
  comment: String,
  likes: Number,
  reply: [] //help
}

const feedNetworkSchema = {
  entryID: String,
  likes: Number,
  comments: [commentSchema]
}

const feedNetwork = mongoose.model("feedNetwork", feedNetworkSchema);

const entrySchema = {
  entryID: String,
  size: Number,
  title: String,
  content: String,
  media: mediaObjSchema,
  backgroundAudio: String,
  backgroundImage: String,
  date: String,
  weather: {
    desc: String,
    icon: String,
  },
  private: Boolean,
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
  picture: String,
  cookieID: String,
  entries: [entrySchema],
  following: [String],
  followers: [String],
  privatePosts: 0,
  publicPosts: 0,
});

const Users = mongoose.model("user", userSchema);

const networkSchema = new mongoose.Schema({
  users: [String],
  userCount: Number,
});

const Network = mongoose.model("network", networkSchema);

function reduceEntry(entry) {
  entry.size = sizeof(entry);
  // console.log(req.body);
  const newEntry = new Entry(entry);
  let { backgroundAudio: bAud, media: myMedia } = newEntry;
  if (bAud.length > 0) {
    const audioWare = new MediaWarehouse({
      id: uniqid(),
      data: bAud,
    });
    newEntry.backgroundAudio = audioWare.id;
    audioWare.save();
  }

  if (myMedia.image.length !== 0) {
    for (let i = 0; i < myMedia.image.length; i++) {
      const tempWare = new MediaWarehouse({
        id: uniqid(),
        data: myMedia.image[i],
      });
      myMedia.image[i] = tempWare.id;
      tempWare.save();
    }
  }

  if (myMedia.video.length !== 0) {
    for (let i = 0; i < myMedia.video.length; i++) {
      const tempWare = new MediaWarehouse({
        id: uniqid(),
        data: myMedia.video[i],
      });
      myMedia.video[i] = tempWare.id;
      tempWare.save();
    }
  }

  if (myMedia.audio.length !== 0) {
    for (let i = 0; i < myMedia.audio.length; i++) {
      const tempWare = new MediaWarehouse({
        id: uniqid(),
        data: myMedia.audio[i],
      });
      myMedia.audio[i] = tempWare.id;
      tempWare.save();
    }
  }
  return newEntry;
}

function deleteEntry(mainEntry) {
  const entry = mainEntry;
  MediaWarehouse.deleteOne({ id: entry.backgroundAudio })
    .then(function () {
      console.log("Data deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  for (let i = 0; i < entry.media.image.length; i++) {
    MediaWarehouse.deleteOne({ id: entry.media.image[i] })
      .then(function () {
        console.log("image deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }
  for (let i = 0; i < entry.media.video.length; i++) {
    MediaWarehouse.deleteOne({ id: entry.media.video[i] });
  }
  for (let i = 0; i < entry.media.audio.length; i++) {
    MediaWarehouse.deleteOne({ id: entry.media.audio[i] });
  }
}

app.post("/submit-entry", (req, res) => {
  console.log("post received");
  console.log("size of post: " + sizeof(req.body));
  Users.findOne({ username: req.body.user }, async function (err, results) {
    var newEntry = null;
    if (err) throw err;
    if (results) {
      for (let i = 0; i < results.entries.length; i++) {
        if (results.entries[i].entryID === req.body.entry.entryID) {
          if (results.entries[i].private === true)
            results.privatePosts = results.privatePosts - 1;
          else results.publicPosts = results.publicPosts - 1;
          deleteEntry(results.entries[i]);
          results.entries.splice(i, 1);
          newEntry = reduceEntry(req.body.entry);
          if (newEntry.private === true)
            results.privatePosts = results.privatePosts + 1;
          else results.publicPosts = results.publicPosts + 1;
          results.entries.push(newEntry);
        }
      }
      if (newEntry === null) {
        req.body.entry.entryID = uniqid();
        newEntry = reduceEntry(req.body.entry);
        if (newEntry.private === true)
          results.privatePosts = results.privatePosts + 1;
        else results.publicPosts = results.publicPosts + 1;
        results.entries.push(newEntry);
      }
      results.save();
      res.send({ mesage: "success", savedEntry: newEntry });
    }
  });
});

app.post("/removeEntry", (req, res) => {
  console.log("hellp");
  Users.findOne({ username: req.body.user }, async (err, results) => {
    if (err) throw err;
    if (results) {
      for (let i = 0; i < results.entries.length; i++) {
        if (results.entries[i].entryID === req.body.entryID) {
          if (results.entries[i].private === true)
            results.privatePosts = results.privatePosts - 1;
          else results.publicPosts = results.publicPosts - 1;
          deleteEntry(results.entries[i]);
          results.entries.splice(i, 1);
          break;
        }
      }
      results.save();
      res.send({ message: "success" });
    }
  });
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
                const hashedPassword = await bcrypt.hash(req.body.password, 10); //the function bcrypt.hash hashes the password entered

                const newUser = new Users({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  username: req.body.username,
                  cookieID: "",
                  email: req.body.email,
                  picture: req.body.picture,
                  password: hashedPassword,
                  privatePosts: 0,
                  publicPosts: 0,
                });
                await newUser.save();
                Network.findOne({}, (err, data) => {
                  if (err) throw err;
                  data.users.push(req.body.username);
                  data.userCount = data.userCount + 1;
                  data.save();
                });
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
  Users.findOne(
    {
      username: req.body.username,
    },
    async (err, foundUser) => {
      if (err) throw err;
      else {
        if (foundUser) {
          //Username has been found in the database
          bcrypt.compare(
            //this function compares the entered password with the password saved in the database
            req.body.password,
            foundUser.password,
            function (err, result) {
              if (result === true) {
                //the typed in password and the password saved in the database matches
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

app.post("/getFullData", (req, res) => {
  async function getData() {
    let entry = req.body;
    console.log("before fetch: \n" + entry.backgroundAudio);
    if (entry.backgroundAudio.length > 0) {
      console.log("aud exists");
      MediaWarehouse.findOne(
        { id: entry.backgroundAudio },
        async (err, foundMedia) => {
          if (err) throw err;
          else if (foundMedia) {
            entry.backgroundAudio = foundMedia.data;
          }
        }
      );
    }

    if (entry.media.image.length !== 0) {
      for (let i = 0; i < entry.media.image.length; i++) {
        MediaWarehouse.findOne(
          { id: entry.media.image[i] },
          async (err, foundMedia) => {
            if (err) throw err;
            else if (foundMedia) {
              entry.media.image[i] = foundMedia.data;
            }
          }
        );
      }
    }

    if (entry.media.video.length !== 0) {
      for (let i = 0; i < entry.media.video.length; i++) {
        MediaWarehouse.findOne(
          { id: entry.media.video[i] },
          async (err, foundMedia) => {
            if (err) throw err;
            else if (foundMedia) {
              entry.media.video[i] = foundMedia.data;
            }
          }
        );
      }
    }

    if (entry.media.audio.length !== 0) {
      for (let i = 0; i < entry.media.audio.length; i++) {
        MediaWarehouse.findOne(
          { id: entry.media.audio[i] },
          async (err, foundMedia) => {
            if (err) throw err;
            else if (foundMedia) {
              entry.media.audio[i] = foundMedia.data;
            }
          }
        );
      }
    }

    let myPromise = new Promise(function (myResolve, myReject) {
      // console.log("in promise");
      // console.log(entry);
      // console.log(sizeof(entry) + "    " + req.body.size);
      let timeout = (n) => {
        setTimeout(() => {
          if (sizeof(entry) >= req.body.size - 1000) myResolve();
          // else if(count >= 20) myResolve();
          else {
            timeout(n);
          }
        }, n);
      };
      timeout(50);
    });
    myPromise.then(() => {
      res.send(entry);
    });
  }
  getData();
});

app.post("/fetchUsers", (req, res) => {
  let userArray = [];
  Network.findOne({}, async (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.userCount; i++) {
      Users.findOne({ username: result.users[i] }, async (err, user) => {
        if (err) throw err;
        // console.log(user);
        if (user.username !== req.body.username) {
          userArray.push({
            username: user.username,
            picture: user.picture,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }
      });
    }
    let readyPromise = new Promise(function (resolve, reject) {
      let timeout = (n) => {
        console.log(req.body.following);
        setTimeout(() => {
          if (userArray.length === result.userCount - 1) {
            userArray = userArray.filter((n) => {
              console.log("checking: " + n.username);
              return !req.body.following.includes(n.username);
            });
            // console.log(userArray);
            res.send({ users: userArray });
            resolve();
          } else timeout(n);
        }, n);
      };
      timeout(50);
    });
    readyPromise.then(() => {});
  });
});

app.post("/fetchFollowers", (req, res) => {
  const followerArray = [];
  Users.findOne(
    {
      username: req.body.username,
      cookieID: req.body.cookieID,
    },
    async (err, user) => {
      if (err) throw err;
      for (let i = 0; i < user.followers.length; i++) {
        Users.findOne({ username: user.followers[i] }, (err, follower) => {
          if (err) throw err;
          followerArray.push({
            username: follower.username,
            picture: follower.picture,
            firstName: follower.firstName,
            lastName: follower.lastName,
          });
        });
      }
      let readyPromise = new Promise(function (resolve, reject) {
        let timeout = (n) => {
          // console.log("in timeout: ");
          setTimeout(() => {
            if (followerArray.length === user.followers.length) resolve();
            else timeout(n);
          }, n);
        };
        timeout(50);
      });
      readyPromise.then(() => {
        res.send({ followers: followerArray });
      });
    }
  );
});

app.post("/fetchFollowing", (req, res) => {
  const followingArray = [];
  Users.findOne(
    {
      username: req.body.username,
      cookieID: req.body.cookieID,
    },
    async (err, user) => {
      if (err) throw err;
      for (let i = 0; i < user.following.length; i++) {
        Users.findOne({ username: user.following[i] }, (err, following) => {
          if (err) throw err;
          followingArray.push({
            username: following.username,
            picture: following.picture,
            firstName: following.firstName,
            lastName: following.lastName,
          });
        });
      }
      let readyPromise = new Promise(function (resolve, reject) {
        let timeout = (n) => {
          // console.log("in timeout: ");
          setTimeout(() => {
            if (followingArray.length === user.following.length) resolve();
            else timeout(n);
          }, n);
        };
        timeout(50);
      });
      readyPromise.then(() => {
        res.send({ following: followingArray });
      });
    }
  );
});

app.post("/follow", (req, res) => {
  console.log(req.body);
  Users.findOne(
    { username: req.body.username, cookieID: req.body.cookieID },
    (err, user) => {
      if (err) throw err;
      user.following.push(req.body.follow);
      user.following = [...new Set(user.following)];
      user.save();
      Users.findOne({ username: req.body.follow }, (err, user) => {
        if (err) throw err;
        user.followers.push(req.body.username);
        user.followers = [...new Set(user.followers)];
        user.save();
        res.send({ status: true });
      });
    }
  );
});

app.post("/unfollow", (req, res) => {
  console.log(req.body);
  Users.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    let index = user.following.indexOf(req.body.unfollow);
    user.following.splice(index, 1);
    user.save();
    Users.findOne({ username: req.body.unfollow }, (err, user) => {
      if (err) throw err;
      let index = user.followers.indexOf(req.body.username);
      user.followers.splice(index, 1);
      // user.followers.push(req.body.username);
      // user.followers = [...new Set(user.followers)];
      user.save();
      res.send({ status: true });
    });
  });
});

app.post("/getFeed", (req, res) => {
  console.log(req.body);
  const feedArr = [];
  let feedCount = 0;
  for (let i = 0; i < req.body.following.length; i++) {
    Users.findOne({ username: req.body.following[i] }, (err, user) => {
      if (err) throw err;
      feedCount = feedCount + user.publicPosts;
      for (let j = 0; j < user.entries.length; j++) {
        if (user.entries[j].private === false) {
          feedArr.push({
            creator: {
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              picture: user.picture,
            },
            entry: user.entries[j],
          });
        }
      }
    });
  }
  let readyPromise = new Promise(function (resolve, reject) {
    let timeout = (n) => {
      // console.log("in timeout: ");
      setTimeout(() => {
        if (feedArr.length === feedCount) resolve();
        else timeout(n);
      }, n);
    };
    timeout(50);
  });
  readyPromise.then(() => {
    res.send({ feed: feedArr });
  });
  // res.send({ mess: "helo" });
});

//------------------------------------------------------------- Weather API --------------------------------------------------------------------

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
