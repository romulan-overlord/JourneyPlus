const express = require("express");
const cors = require("cors");
const uniqid = require("uniqid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sizeof = require("object-sizeof");
const bcrypt = require("bcrypt"); //Used to hash passwords
const saltRounds = 10; //Hashes the password 10 times which further enhances the security
const https = require("https");
const send = require("./mailSender");
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

const replySchema = {
  commentID: String,
  commentor: String,
  comment: String,
  likes: Number,
  likedBy: [String],
  timePosted: Number,
};

const commentSchema = {
  commentID: String,
  commentor: String,
  comment: String,
  likes: Number,
  likedBy: [String],
  replies: [replySchema],
  timePosted: Number,
};

const Comment = mongoose.model("comment", commentSchema);

const feedNetworkSchema = {
  entryID: String,
  likes: Number,
  likedBy: [String],
  comments: [commentSchema],
};

const FeedNetwork = mongoose.model("feedNetwork", feedNetworkSchema);

const entrySchema = {
  entryID: String,
  owner: String,
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
  time: String,
  shared: [String],
  lastModifiedBy: String,
  lastModified: Number,
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
  shared: [{ username: String, entryID: String }],
  following: [String],
  followers: [String],
  privatePosts: 0,
  publicPosts: 0,
  otp: String,
});

const Users = mongoose.model("user", userSchema);

const networkSchema = new mongoose.Schema({
  users: [String],
  userCount: Number,
});

const Network = mongoose.model("network", networkSchema);

function reduceUser(user) {
  const newUser = new Users(user);
  if (newUser.picture.length > 0) {
    newUser.picture = uploadToWarehouse(newUser.picture);
  }
  return newUser;
}

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

function deleteEntry(mainEntry, permanent) {
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
  if (permanent) {
    FeedNetwork.deleteOne({ entryID: entry.entryID })
      .then(function () {
        console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
    for (let i = 0; i < entry.shared.length; i++) {
      Users.findOne({ username: entry.shared[i] }, (err, user) => {
        if (err) {
          console.log("error finding user the deleted entry is shared with");
          throw err;
        }
        for (let j = 0; j < user.shared.length; j++) {
          if (user.shared[j].entryID === entry.entryID) {
            user.shared.splice(j, 1);
            user.save();
          }
        }
      });
    }
  }
}

app.post("/submit-entry", (req, res) => {
  console.log("post received");
  // console.log("size of post: " + sizeof(req.body));
  Users.findOne(
    {
      username:
        req.body.entry.owner.length === 0
          ? req.body.user
          : req.body.entry.owner,
    },
    async function (err, results) {
      console.log("user found");
      var newEntry = null;
      let update = false;
      if (err) throw err;
      if (results) {
        if (req.body.entry.owner.length === 0) {
          req.body.entry.entryID = uniqid();
          req.body.entry.owner = req.body.user;
          newEntry = reduceEntry(req.body.entry);
          if (newEntry.private === true)
            results.privatePosts = results.privatePosts + 1;
          else {
            results.publicPosts = results.publicPosts + 1;
            const feed = new FeedNetwork({
              entryID: newEntry.entryID,
              likes: 0,
              comments: [],
            });
            feed.save();
          }
          results.entries.push(newEntry);
          update = true;
          console.log("new entry pushed");
        } else {
          for (let i = 0; i < results.entries.length; i++) {
            if (results.entries[i].entryID === req.body.entry.entryID) {
              if (results.entries[i].private === true)
                results.privatePosts = results.privatePosts - 1;
              else results.publicPosts = results.publicPosts - 1;
              deleteEntry(results.entries[i], false);
              results.entries.splice(i, 1);
              newEntry = reduceEntry(req.body.entry);
              // if (req.body.user === req.body.entry.owner) {
              if (newEntry.private === true)
                results.privatePosts = results.privatePosts + 1;
              else {
                results.publicPosts = results.publicPosts + 1;
                console.log("creating new feedNet for: " + newEntry.entryID);
                FeedNetwork.findOne(
                  { entryID: newEntry.entryID },
                  (err, result) => {
                    if (err) throw err;
                    if (result) return;
                    const feed = new FeedNetwork({
                      entryID: newEntry.entryID,
                      likes: 0,
                      likedBy: [],
                      comments: [],
                    });
                    feed.save();
                    return;
                  }
                );
              }
              // }
              results.entries.push(newEntry);
            }
          }
          if (req.body.entry.owner === req.body.user) update = true;
        }
        console.log(newEntry);

        results.save();
        console.log("user saved");
        res.send({ mesage: "success", savedEntry: newEntry, update: update });
      }
    }
  );
});

app.post("/removeEntry", (req, res) => {
  // console.log("hellp");
  Users.findOne({ username: req.body.user }, async (err, results) => {
    if (err) throw err;
    if (results) {
      for (let i = 0; i < results.entries.length; i++) {
        if (results.entries[i].entryID === req.body.entryID) {
          if (results.entries[i].private === true)
            results.privatePosts = results.privatePosts - 1;
          else results.publicPosts = results.publicPosts - 1;
          deleteEntry(results.entries[i], true);
          results.entries.splice(i, 1);
          break;
        }
      }
      results.save();
      res.send({ message: "success" });
    }
  });
});

app.post("/share", (req, res) => {
  let retList = null;
  Users.findOne({ username: req.body.shareTo }, (err, user) => {
    if (err) {
      console.log("error finding user to share entry with");
      throw err;
    }
    user.shared.push({
      username: req.body.owner,
      entryID: req.body.entryID,
    });
    user.save();
  });
  Users.findOne({ username: req.body.owner }, (err, user) => {
    if (err) {
      console.log("error finding owner of post being shared");
      throw err;
    }
    for (let i = 0; i < user.entries.length; i++) {
      if (user.entries[i].entryID === req.body.entryID) {
        user.entries[i].shared.push(req.body.shareTo);
        retList = user.entries[i].shared;
        break;
      }
    }
    user.save();
    res.send({ list: retList });
  });
});

app.post("/unshare", (req, res) => {
  let retList = null;
  Users.findOne({ username: req.body.unshareTo }, (err, user) => {
    if (err) {
      console.log("error finding user to share entry with");
      throw err;
    }
    for (let i = 0; i < user.shared.length; i++) {
      if (user.shared[i].entryID === req.body.entryID) {
        user.shared.splice(i, 1);
      }
    }
    user.save();
  });
  Users.findOne({ username: req.body.owner }, (err, user) => {
    if (err) {
      console.log("error finding owner of post being shared");
      throw err;
    }
    for (let i = 0; i < user.entries.length; i++) {
      if (user.entries[i].entryID === req.body.entryID) {
        let index = user.entries[i].shared.indexOf(req.body.shareTo);
        user.entries[i].shared.splice(index, 1);
        retList = user.entries[i].shared;
        break;
      }
    }
    user.save();
    res.send({ list: retList });
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
                // send(
                //   req.body.email,
                //   "SignUp Confirmation",
                //   "Congratulations on successfully signing up on this Journey with us."
                // )
                //   .then((messageId) =>
                //     console.log("Message sent successfully:", messageId)
                //   )
                //   .catch((err) => console.error(err));
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
  console.log("Inside login");
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
                if (foundUser.picture.length < 2) {
                  foundUser.entries.sort((a, b) => {
                    return b.lastModified - a.lastModified;
                  });
                  res.send({
                    success: "802", //The user is redirected to the main page
                    user: foundUser,
                  });
                } else {
                  // console.log("fetching picture");
                  MediaWarehouse.findOne(
                    { id: foundUser.picture },
                    (err, picture) => {
                      if (err) {
                        console.log(
                          "error while fetching user profile picture"
                        );
                        throw err;
                      }
                      console.log(foundUser);
                      foundUser.picture = picture.data;
                      foundUser.entries.sort((a, b) => {
                        return b.lastModified - a.lastModified;
                      });
                      // console.log("sorted user entries: " + foundUser.entries);
                      //sort foundUser.entries
                      res.send({
                        success: "802", //The user is redirected to the main page
                        user: foundUser,
                      });
                    }
                  );
                }
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
            if (foundUser.picture.length < 2) {
              // console.log("no picture");
              foundUser.entries.sort((a, b) => {
                return b.lastModified - a.lastModified;
              });
              res.send({
                success: "802", //The user is redirected to the main page
                user: foundUser,
              });
            } else {
              // console.log("fetching picture in auto");
              MediaWarehouse.findOne(
                { id: foundUser.picture },
                (err, picture) => {
                  if (err) {
                    console.log("error while fetching user profile picture");
                    throw err;
                  }
                  foundUser.picture = picture.data;
                  foundUser.entries.sort((a, b) => {
                    return b.lastModified - a.lastModified;
                  });
                  // console.log("sorted user entries: " + foundUser.entries);
                  res.send({
                    success: "802", //The user is redirected to the main page
                    user: foundUser,
                  });
                }
              );
            }
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

app.post("/getOTP", (req, res) => {
  console.log("handling submit");
  Users.findOne({ email: req.body.email }, async (err, foundUser) => {
    if (err) throw err;
    else {
      if (foundUser) {
        let otp = uniqid().substring(uniqid().length - 6);
        Users.updateOne(
          { email: req.body.email },
          { otp: otp },
          function (err, docs) {
            if (err) throw err;
            else {
              Users.findOne(
                { email: req.body.email },
                async (err, updatedUser) => {
                  if (err) throw err;
                  else {
                    if (updatedUser) {
                      console.log(updatedUser);
                      console.log("OTP: " + updatedUser.otp);

                      send(
                        req.body.email,
                        "OTP Code",
                        "Dear " +
                          foundUser.username +
                          " " +
                          "your OTP code is " +
                          updatedUser.otp +
                          "."
                      )
                        .then((messageId) =>
                          console.log("Message sent successfully:", messageId)
                        )
                        .catch((err) => console.error(err));

                      res.send({ success: "OTPsuccess" });
                    }
                  }
                }
              );
            }
          }
        );
      } else if (!foundUser) {
        res.send({ success: "InvalidEmail" });
      }
    }
  });
});

app.post("/confirmOTP", (req, res) => {
  Users.findOne({ otp: req.body.otp }, async (err, foundUser) => {
    if (err) throw err;
    else {
      if (foundUser) {
        res.send({ success: "OTPmatch" });
      } else {
        res.send({ success: "OTPIncorrect" });
      }
    }
  });
});

app.post("/resetPassword", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.resetPwd, 10);
  Users.updateOne(
    { email: req.body.email },
    { password: hashedPassword },
    (err, result) => {
      if (err) throw err;
      else {
        if (result) {
          res.send({ success: "resetSuccess" });
        } else {
          res.send({ success: "resetFail" });
        }
      }
    }
  );
});

app.post("/getFullData", (req, res) => {
  async function getData() {
    let entry = req.body;
    // console.log("before fetch: \n" + entry.backgroundAudio);
    if (entry.backgroundAudio.length > 0) {
      // console.log("aud exists");
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

function getUsers(list) {
  let userArray = [];
  for (let i = 0; i < list.length; i++) {
    Users.findOne({ username: list[i] }, async (err, user) => {
      if (err) throw err;
      // console.log("user found: " + user.username);
      if (user.picture.length > 2) {
        MediaWarehouse.findOne({ id: user.picture }, (err, data) => {
          if (err) {
            console.log("error in getting picture.");
            throw err;
          }
          // console.log("got user picture");
          let tempPic = "";
          if (data) tempPic = data.data;
          userArray.push({
            username: user.username,
            picture: tempPic,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            followers: user.followers,
            following: user.following,
          });
        });
      } else {
        userArray.push({
          username: user.username,
          picture: "",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          followers: user.followers,
          following: user.following,
        });
      }
    });
  }
  let readyPromise = new Promise(function (resolve, reject) {
    let timeout = (n) => {
      setTimeout(() => {
        if (userArray.length === list.length) {
          // return userArray;
          resolve(userArray);
        } else timeout(n);
      }, n);
    };
    timeout(50);
  });
  return readyPromise;
}

app.post("/fetchLikers", async (req, res) => {
  console.log("fetching likers");
  const likedArr = await getUsers(req.body.list);
  res.send({ list: likedArr });
});

app.post("/fetchUsers", async (req, res) => {
  let userArray = [];
  Network.findOne({}, async (err, result) => {
    if (err) throw err;
    userArray = await getUsers(result.users);
    userArray = userArray.filter((n) => {
      return (
        !req.body.following.includes(n.username) &&
        n.username !== req.body.username
      );
    });
    res.send({ users: userArray });
  });
});

app.post("/fetchFollowers", (req, res) => {
  let followerArray = [];
  console.log("fetching followers: ");
  console.log(req.body);
  Users.findOne(
    {
      username: req.body.username,
      cookieID: req.body.cookieID,
    },
    async (err, user) => {
      if (err) {
        console.log("error finding main user");
        throw err;
      }
      console.log("found main user: " + req.body.username);
      followerArray = await getUsers(user.followers);
      res.send({ followers: followerArray });
    }
  );
});

app.post("/fetchFollowing", (req, res) => {
  // console.log("in fetch Following: " + req.body.username);
  let followingArray = [];
  Users.findOne(
    {
      username: req.body.username,
      cookieID: req.body.cookieID,
    },
    async (err, user) => {
      if (err) throw err;
      followingArray = await getUsers(user.following);
      console.log("responding following");
      res.send({ following: followingArray });
    }
  );
});

app.post("/follow", (req, res) => {
  // console.log(req.body);
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
  // console.log(req.body);
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
  console.log("getting feed from: " + req.body);
  const feedArr = [];
  let feedCount = 0;
  for (let i = 0; i < req.body.following.length; i++) {
    Users.findOne({ username: req.body.following[i] }, (err, user) => {
      if (err) throw err;
      feedCount = feedCount + user.publicPosts;
      for (let j = 0; j < user.entries.length; j++) {
        if (user.entries[j].private === false) {
          if (user.picture.length > 0) {
            MediaWarehouse.findOne({ id: user.picture }, (err, data) => {
              if (err) {
                console.log("error in getting picture.");
                throw err;
              }
              let tempPic = "";
              if (data) tempPic = data.data;
              feedArr.push({
                creator: {
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  picture: tempPic,
                  email: user.email,
                  following: user.following,
                  followers: user.followers,
                },
                entry: user.entries[j],
              });
            });
          } else {
            feedArr.push({
              creator: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: "",
                email: user.email,
                following: user.following,
                followers: user.followers,
              },
              entry: user.entries[j],
            });
          }
        }
      }
    });
  }
  let readyPromise = new Promise(function (resolve, reject) {
    let timeout = (n) => {
      console.log("in timeout: ");
      setTimeout(() => {
        console.log(feedArr.length + "<-feedArr feedcount -> " + feedCount);
        if (feedArr.length === feedCount) {
          feedArr.sort((a, b) => {
            return b.entry.lastModified - a.entry.lastModified;
          });
          resolve();
        } else timeout(n);
      }, n);
    };
    timeout(50);
  });
  readyPromise.then(() => {
    res.send({ feed: feedArr });
  });
  // res.send({ mess: "helo" });
});

app.post("/getUserFeed", (req, res) => {
  const feedArr = [];
  let feedReady = false;
  Users.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log("error finding foreign user");
      throw err;
    }
    feedCount = user.publicPosts;
    for (let i = 0; i < user.entries.length; i++) {
      if (user.entries[i].private === false) {
        feedArr.push({
          creator: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            email: user.email,
            following: user.following,
            followers: user.followers,
          },
          entry: user.entries[i],
        });
      }
    }
    MediaWarehouse.findOne({ id: user.picture }, (err, data) => {
      if (err) {
        console.log("error in getting picture.");
        throw err;
      }
      for (let i = 0; i < feedArr.length; i++) {
        if (data) feedArr[i].creator.picture = data.data;
      }
      feedReady = true;
    });
  });
  let readyPromise = new Promise(function (resolve, reject) {
    let timeout = (n) => {
      setTimeout(() => {
        if (feedReady) resolve();
        else timeout(n);
      }, n);
    };
    timeout(50);
  });
  readyPromise.then(() => {
    res.send({ feed: feedArr });
  });
});

app.post("/getShared", async (req, res) => {
  let check = false;
  let shared = null;
  let retArr = [];
  console.log("before first query");
  Users.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      console.log("error finding main user in getShared");
      throw err;
    }
    shared = user.shared;
    console.log("inside first query" + shared);
    check = true;
  });
  let fetcher = (n) => {
    setTimeout(() => {
      if (shared) {
        console.log("start building sharedList");
        for (let i = 0; i < shared.length; i++) {
          Users.findOne({ username: shared[i].username }, (err, user) => {
            if (err) {
              console.log("error finding user whose post is shared");
              throw err;
            }
            for (let j = 0; j < user.entries.length; j++) {
              // for(let k = i; k < shared.length; k++{

              // })
              if (user.entries[j].entryID === shared[i].entryID) {
                if (user.picture.length > 2) {
                  MediaWarehouse.findOne({ id: user.picture }, (err, data) => {
                    if (err) {
                      console.log("error in getting picture.");
                      throw err;
                    }
                    let tempPic = "";
                    if (data) tempPic = data.data;
                    retArr.push({
                      creator: {
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        picture: tempPic,
                        email: user.email,
                        following: user.following,
                        followers: user.followers,
                      },
                      entry: user.entries[j],
                    });
                  });
                } else {
                  retArr.push({
                    creator: {
                      username: user.username,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      picture: "",
                      email: user.email,
                      following: user.following,
                      followers: user.followers,
                    },
                    entry: user.entries[j],
                  });
                }
              }
              // break;
            }
          });
        }
      } else fetcher(n);
    }, n);
  };
  fetcher(50);
  console.log("help: " + shared);
  let readyPromise = new Promise(function (resolve, reject) {
    let timeout = (n) => {
      console.log("in timeout: ");
      setTimeout(() => {
        if (shared) {
          console.log("checking resolve: ");
          console.log(retArr.length + "<-retArr shared -> " + shared.length);
          if (retArr.length === shared.length) {
            //sort retArr
            resolve();
          } else timeout(n);
        } else timeout(n);
      }, n);
    };
    timeout(50);
  });
  readyPromise.then(() => {
    res.send({ shared: retArr });
  });
});

function getUserPicture(comment) {
  return new Promise((resolve, reject) => {
    Users.findOne({ username: comment.commentor }, async (err, user) => {
      if (err) throw err;
      console.log("commentor found: ");
      console.log(comment);
      resolve({
        commentID: comment.commentID,
        commentor: comment.commentor,
        commentorPic: await fetchFromWarehouse(user.picture),
        comment: comment.comment,
        likes: comment.likes,
        likedBy: comment.likedBy,
        replies: comment.replies,
        timePosted: comment.timePosted,
      });
    });
  });
}

async function buildComments(comments) {
  // if(comments.length > 0) console.log("sketchy stuff: " + comments[0]);
  let i = 0;
  const arr = [];
  let temp = null;
  while (i < comments.length) {
    // console.log("inside while : " + comments.length);
    temp = await getUserPicture(comments[i]);
    if (comments[i].replies) {
      temp.replies = await buildComments(comments[i].replies);
    }
    arr.push(temp);

    i++;
  }
  return new Promise((resolve, reject) => {
    timeout = (n) => {
      setTimeout(() => {
        // console.log(i + "<<loop   length>>" + comments.length);
        if (i >= comments.length) resolve(arr);
        else timeout(n);
      }, n);
    };
    timeout(50);
  });
}

function sortCommentsAndReplies(comments) {
  let i = 0;
  let max = 0;
  comments.sort((a, b) => {
    return b.timePosted - a.timePosted;
  });

  for (i = 0; i < comments.length; i++) {
    comments[i].replies.sort((a, b) => {
      return b.timePosted - a.timePosted;
    });
  }

  return new Promise((resolve, reject) => {
    timeout = (n) => {
      setTimeout(() => {
        // console.log(i + "<<loop   length>>" + comments.length);
        if (i >= comments.length) resolve(comments);
        else timeout(n);
      }, n);
    };
    timeout(50);
  });
}

app.post("/getLikes", (req, res) => {
  console.log(req.body);
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) throw err;
    if (data) {
      console.log("building comments: ");
      // console.log(data);
      let temp = await buildComments(data.comments);
      // console.log(temp);
      temp = await sortCommentsAndReplies(temp);
      console.log("comments built in getLikes");
      // console.log(temp);

      res.send({
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      });
    }
  });
});

app.post("/like", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
    if (err) console.log("error finding feedNetwork on like");
    if (data) {
      data.likes = data.likes + 1;
      data.likedBy.push(req.body.likedBy);
      data.save();
      res.send({ message: "success" });
    }
  });
});

app.post("/unlike", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
    if (err) console.log("error finding feedNetwork on unlike");
    if (data) {
      data.likes = data.likes - 1;
      let index = data.likedBy.indexOf(req.body.unlikedBy);
      data.likedBy.splice(index, 1);
      data.save();
      res.send({ message: "success" });
    }
  });
});

app.post("/postComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.post }, async (err, data) => {
    if (err) {
      console.log("Error in posting comment");
      throw err;
    }
    data.comments.push({
      commentID: uniqid(),
      commentor: req.body.commentor,
      comment: req.body.comment,
      likes: 0,
      replies: [],
      timePosted: req.body.timePosted,
    });
    data.save();
    let temp = await buildComments(data.comments);
    temp = await sortCommentsAndReplies(temp);
    res.send({
      update: {
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      },
    });
  });
});

app.post("/deleteComment", (req, res) => {
  console.log("deleting comment");
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("Error in deleting comment");
      throw err;
    }
    let index = -1;
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.commentID) {
        index = i;
        break;
      }
    }
    if (index === -1) res.send({ data: "error" });
    data.comments.splice(index, 1);
    data.save();
    let temp = await buildComments(data.comments);
    temp = await sortCommentsAndReplies(temp);
    res.send({
      data: {
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      },
    });
    // res.send({ data: data });
  });
});

app.post("/deleteReply", (req, res) => {
  console.log("deleting reply");
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("Error in deleting reply");
      throw err;
    }
    let index = -1;
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.parentID) {
        index = i;
        break;
      }
    }
    if (index === -1) res.send({ data: "error" });
    for (let j = 0; j < data.comments[index].replies.length; j++) {
      console.log("in 2nd loop");
      if (data.comments[index].replies[j].commentID === req.body.commentID) {
        console.log("reply found");
        data.comments[index].replies.splice(j, 1);
        data.save();
        let temp = await buildComments(data.comments);
        temp = await sortCommentsAndReplies(temp);
        res.send({
          data: {
            entryID: data.entryID,
            likes: data.likes,
            likedBy: data.likedBy,
            comments: temp,
          },
        });
      }
    }
    // data.comments.splice(index, 1);

    // res.send({ data: data });
  });
});

app.post("/postReply", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.post }, async (err, data) => {
    if (err) {
      console.log("Error in posting comment");
      throw err;
    }
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.commentID) {
        data.comments[i].replies.push({
          commentID: uniqid(),
          commentor: req.body.commentor,
          comment: req.body.comment,
          likes: 0,
          likedBy: [],
          timePosted: req.body.timePosted,
        });
      }
    }
    data.save();
    let temp = await buildComments(data.comments);
    temp = await sortCommentsAndReplies(temp);
    res.send({
      update: {
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      },
    });
  });
});

app.post("/likeComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("error liking comment");
      throw err;
    }
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.commentID) {
        data.comments[i].likes += 1;
        data.comments[i].likedBy.push(req.body.likedBy);
        data.save();
        break;
      }
    }
    let temp = await buildComments(data.comments);
    temp = await sortCommentsAndReplies(temp);
    res.send({
      data: {
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      },
    });
    // res.send({ data: data });
  });
});

app.post("/likeReply", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("error liking comment");
      throw err;
    }
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.parentID) {
        for (let j = 0; j < data.comments[i].replies.length; j++) {
          if (data.comments[i].replies[j].commentID === req.body.commentID) {
            data.comments[i].replies[j].likes += 1;
            data.comments[i].replies[j].likedBy.push(req.body.likedBy);
            data.save();
            let temp = await buildComments(data.comments);
            temp = await sortCommentsAndReplies(temp);
            res.send({
              data: {
                entryID: data.entryID,
                likes: data.likes,
                likedBy: data.likedBy,
                comments: temp,
              },
            });
          }
        }
      }
    }
  });
});

app.post("/unlikeComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("error unliking comment");
      throw err;
    }
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.commentID) {
        data.comments[i].likes -= 1;
        data.comments[i].likedBy.splice(
          data.comments[i].likedBy.indexOf(req.body.likedBy),
          1
        );
        data.save();
        break;
      }
    }
    let temp = await buildComments(data.comments);
    temp = await sortCommentsAndReplies(temp);
    res.send({
      data: {
        entryID: data.entryID,
        likes: data.likes,
        likedBy: data.likedBy,
        comments: temp,
      },
    });
  });
});

app.post("/unlikeReply", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, async (err, data) => {
    if (err) {
      console.log("error unliking comment");
      throw err;
    }
    for (let i = 0; i < data.comments.length; i++) {
      if (data.comments[i].commentID === req.body.parentID) {
        for (let j = 0; j < data.comments[i].replies.length; j++) {
          if (data.comments[i].replies[j].commentID === req.body.commentID) {
            data.comments[i].replies[j].likes -= 1;
            data.comments[i].replies[j].likedBy.splice(
              data.comments[i].replies[j].likedBy.indexOf(req.body.unlikedBy),
              1
            );
            data.save();
            let temp = await buildComments(data.comments);
            temp = await sortCommentsAndReplies(temp);
            res.send({
              data: {
                entryID: data.entryID,
                likes: data.likes,
                likedBy: data.likedBy,
                comments: temp,
              },
            });
          }
        }
      }
    }
  });
});

app.post("/fetchUsersForProfile", (req, res) => {
  // console.log(req.body);
  let userArray = [];
  Network.findOne({}, async (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.userCount; i++) {
      Users.findOne({ username: result.users[i] }, async (err, user) => {
        if (err) throw err;
        userArray.push({
          username: user.username,
          email: user.email,
        });
      });
    }
    let readyPromise = new Promise(function (resolve, reject) {
      let timeout = (n) => {
        setTimeout(() => {
          if (userArray.length === result.userCount) {
            userArray = userArray.filter((n) => {
              // console.log("checking: " + n);
              return !req.body.username.includes(n.username);
            });
            // console.log(userArray);
            res.send({ users: userArray });
            resolve();
          } else timeout(n);
        }, n);
      };
      timeout(50);
    });
    readyPromise.then(() => {
      // console.log("UwU");
    });
  });
});

app.post("/updatePicture", (req, res) => {
  Users.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log("error in update picture");
      throw err;
    }
    MediaWarehouse.deleteOne({ id: user.picture })
      .then(function () {
        console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
    user.picture = req.body.picture;
    user = reduceUser(user);
    user.save();
    res.send({ message: "success" });
  });
});

app.post("/removePicture", (req, res) =>{
  Users.findOne({username: req.body.username}, (err, user) =>{
    if(err) console.log(err);
    if(user){
      MediaWarehouse.deleteOne({id: user.picture})
      .then(() =>{
        console.log("picture deleted");
      })
      .catch((err) =>{
        console.log(err);
      })
      user.picture = '';
      user.save();
      res.send({message: "success"});
    }
  })
});

app.post("/editProfile", (req, res) => {
  // console.log(req.body);
  // console.log(typeof req.body.newFirstName);
  Users.findOne({ username: req.body.oldUsername }, async (err, user) => {
    if (err) throw err;
    if (user) {
      let returnObj = {};
      // if (req.body.newUsername) {
      //   returnObj.username = req.body.newUsername;
      //   user.username = req.body.newUsername;
      //   console.log("New Username :" + user.username);
      // }
      if (req.body.newFirstName) {
        returnObj.firstName = req.body.newFirstName;
        user.firstName = req.body.newFirstName;
        console.log("New FirstName:" + user.firstName);
      }

      if (req.body.newLastName) {
        returnObj.lastName = req.body.newLastName;
        user.lastName = req.body.newLastName;
        console.log("New LastName:" + user.lastName);
      }

      if (req.body.email) {
        returnObj.email = req.body.email;
        user.email = req.body.email;
        console.log("New Email:" + user.email);
      }
      console.log(returnObj);
      user.save();
      // Network.findOne({}, (err, network) => {
      //   if(err){
      //     console.log("Couldn't update Username in network");
      //     throw err;
      //   }
      //   let index = network.users.indexOf(req.body.oldUsername);
      //   network.users[index] = req.body.newUsername;
      //   network.save();
      // })
      res.send({ update: returnObj });
    }
  });
});

app.post("/checkPasswordForChange", (req, res) =>{
  Users.findOne({username: req.body.username}, async(err, user) =>{
    if(err){
      console.log(err);
    }
    if(user){
      bcrypt.compare(req.body.password, user.password, (err, result) =>{
        if(result === true){
          res.send({success:"success"})
        }else{
          res.send({success: "failure"})
        }
      })

    }
  })
});

app.post("/modifyPassword", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.modifiedPwd, 10);
  Users.updateOne(
    { username: req.body.username },
    { password: hashedPassword },
    (err, result) => {
      if (err) throw err;
      else {
        if (result) {
          res.send({ success: "modificationSuccess" });
        } else {
          res.send({ success: "modificationFail" });
        }
      }
    }
  );
});

function uploadToWarehouse(data) {
  //takes data, uploads to warehouse, returns its id
  const newMedia = new MediaWarehouse({
    id: uniqid(),
    data: data,
  });
  newMedia.save();
  return newMedia.id;
}

function fetchFromWarehouse(id) {
  console.log("fetching from warehouse");
  return new Promise((resolve, reject) => {
    MediaWarehouse.findOne({ id: id }, (err, result) => {
      if (err) {
        throw err;
      }
      if (result) resolve(result.data);
      resolve();
    });
  });
}

function deleteFromWarehouse(id) {
  // takes id, query waehouse, delete.
  // return success or failure bool

  MediaWarehouse.deleteOne({ id: id })
    .then(function () {
      console.log("Successfully deleted media");
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });
}

function deleteFromComment(id) {
  Comment.deleteOne({ commentID: id })
    .then(function () {
      console.log("Successfully deleted comment");
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    });
}

app.post("/deleteUser", (req, res) => {
  // console.log("Inside deleteUser");
  // console.log(req.body);
  Users.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (user) {
      bcrypt.compare(
        //this function compares the entered password with the password saved in the database
        req.body.password,
        user.password,
        function (err, result) {
          if (result === true) {
            Users.findOneAndDelete(
              { username: req.body.username },
              (err, t_user) => {
                const user = t_user;
                console.log("User:" + user);
                if (err) throw err;
                if (user) {
                  if (user.picture.length > 0)
                    deleteFromWarehouse(user.picture);

                  Network.findOne({}, async (err, result) => {
                    console.log("Inside Network");
                    //if (err) throw err;
                    let index = result.users.indexOf(req.body.username);
                    result.users.splice(index, 1);
                    result.userCount--;
                    for (let i = 0; i < result.users.length; i++) {
                      Users.findOne(
                        { username: result.users[i] },
                        (err, user) => {
                          if (err) throw err;
                          if (user.followers.includes(req.body.username)) {
                            let index = user.followers.indexOf(
                              req.body.username
                            );
                            user.followers.splice(index, 1);
                          }
                          if (user.following.includes(req.body.username)) {
                            let index = user.following.indexOf(
                              req.body.username
                            );
                            user.following.splice(index, 1);
                          }
                          user.save();
                        }
                      );
                    }
                    result.save();
                  });

                  for (let i = 0; i < user.entries.length; i++) {
                    FeedNetwork.findOneAndDelete(
                      { entryID: user.entries[i].entryID },
                      (err, feed) => {
                        if (err) throw err;
                        if (feed) {
                          if (feed.comments.length > 0) {
                            deleteFromComment(feed.comments[i]);
                          }
                        }
                      }
                    );

                    for (
                      let j = 0;
                      j < user.entries[i].media.image.length;
                      j++
                    ) {
                      deleteFromWarehouse(user.entries[i].media.image[j]);
                    }
                    for (
                      let k = 0;
                      k < user.entries[i].media.video.length;
                      k++
                    ) {
                      deleteFromWarehouse(user.entries[i].media.video[k]);
                    }
                    for (
                      let l = 0;
                      l < user.entries[i].media.audio.length;
                      l++
                    ) {
                      deleteFromWarehouse(user.entries[i].media.audio[l]);
                    }
                    if (user.entries[i].backgroundAudio.length > 0)
                      deleteFromWarehouse(user.backgroundAudio);

                    for (let s = 0; s < user.entries[i].shared.length; s++) {
                      console.log("Inside shared");
                      Users.findOne(
                        { username: user.entries[i].shared[s] },
                        (err, sharedUser) => {
                          if (err) throw err;
                          for (let t = 0; t < sharedUser.shared.length; t++) {
                            console.log(
                              "shared: " + sharedUser.shared[t].username
                            );
                            console.log(user.username);
                            if (
                              sharedUser.shared[t].username === user.username
                            ) {
                              sharedUser.shared.splice(t, 1);
                            }
                          }
                          sharedUser.save();
                        }
                      );
                    }

                    // console.log("Account succesfully deleted");
                    // res.send({
                    //   success: "sucess",
                    // });
                    // deleteEntry(user.entries[i]);
                    // user.entries.splice(i, 1);
                  }
                  console.log("Account succesfully deleted");
                  res.send({
                    success: "success",
                  });
                }
              }
            );
          } else {
            res.send({
              success: "failure", //The entered password is incorrect
            });
          }
        }
      );
    }
  });

  // res.send({mesage: "success"});
});

app.listen(8000, () => {
  //cleanup();
  console.log(`Server is running on port 8000.`);
});

function cleanup() {
  MediaWarehouse.deleteMany({})
    .then(() => {
      console.log("users deleted");
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  Network.deleteMany({})
    .then(() => {
      console.log("users deleted");
      Network.create({ users: ["romulan", "sham"], userCount: 2 });
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  Users.deleteMany({})
    .then(() => {
      console.log("users deleted");
      Users.create({
        firstName: "Ritu Raj",
        lastName: "Pradhan",
        password:
          "$2b$10$LYvW.Zfy1uroKYWtkqBeUOFUQTX5xmDO1vkDZh0pparhkWrh5rEoC",
        username: "romulan",
        email: "riturajpradhan911@gmail.com",
        picture: "",
        cookieID: "lfqxj199",
        following: ["sham"],
        followers: ["sham"],
        privatePosts: 0,
        publicPosts: 0,
        entries: [],
        shared: [],
        __v: 3,
      });
      Users.create({
        firstName: "Vignesh",
        lastName: "Overlord",
        password:
          "$2b$10$YlPJx3j4yC8.RsW7v0Sq1u3JE37oF04iABgv8g6ahKqF7tbLWRl.S",
        username: "sham",
        email: "vig@123.com",
        picture: "",
        cookieID: "lfqxm1jy",
        following: ["romulan"],
        followers: ["romulan"],
        privatePosts: 0,
        publicPosts: 0,
        entries: [],
        shared: [],
        __v: 3,
      });
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  FeedNetwork.deleteMany({})
    .then(() => {
      console.log("users deleted");
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
}
