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
  commentID: String,
  commentor: String,
  commentorPic: String,
  comment: String,
  likes: Number,
  likedBy: [String],
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

function reduceUser(user) {
  const newUser = new Users(user);
  if (newUser.picture.length > 0) {
    const pictureWare = new MediaWarehouse({
      id: uniqid(),
      data: newUser.picture,
    });
    newUser.picture = pictureWare.id;
    pictureWare.save();
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

function deleteEntry(mainEntry) {
  const entry = mainEntry;
  FeedNetwork.deleteOne({ entryID: entry.entryID })
    .then(function () {
      console.log("Data deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
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
  // console.log("post received");
  // console.log("size of post: " + sizeof(req.body));
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
          else {
            results.publicPosts = results.publicPosts + 1;
            const feed = new FeedNetwork({
              entryID: newEntry.entryID,
              likes: 0,
              likedBy: [],
              comments: [],
            });
            feed.save();
          }
          results.entries.push(newEntry);
        }
      }
      if (newEntry === null) {
        req.body.entry.entryID = uniqid();
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
      }
      results.save();
      res.send({ mesage: "success", savedEntry: newEntry });
    }
  });
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
                if (foundUser.picture.length < 2) {
                  // console.log("no picture");
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
                      foundUser.picture = picture.data;
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

app.post("/fetchUsers", (req, res) => {
  let userArray = [];
  console.log("fetchUsers called");
  Network.findOne({}, async (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.userCount; i++) {
      Users.findOne({ username: result.users[i] }, async (err, user) => {
        if (err) throw err;
        console.log("user found: " + user.username);
        if (user.username !== req.body.username) {
          if (user.picture.length > 2) {
            MediaWarehouse.findOne({ id: user.picture }, (err, data) => {
              if (err) {
                console.log("error in getting picture.");
                throw err;
              }
              console.log("got user picture");
              let tempPic = "";
              if (data) tempPic = data.data;
              userArray.push({
                username: user.username,
                picture: tempPic,
                firstName: user.firstName,
                lastName: user.lastName,
              });
              console.log("user push success: " + user.username);
            });
          } else {
            userArray.push({
              username: user.username,
              picture: "",
              firstName: user.firstName,
              lastName: user.lastName,
            });
          }
        }
      });
    }
    let readyPromise = new Promise(function (resolve, reject) {
      let timeout = (n) => {
        // console.log(req.body.following);
        setTimeout(() => {
          if (userArray.length === result.userCount - 1) {
            userArray = userArray.filter((n) => {
              // console.log("checking: " + n.username);
              return !req.body.following.includes(n.username);
            });
            console.log("responding users");
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
      for (let i = 0; i < user.followers.length; i++) {
        Users.findOne({ username: user.followers[i] }, (err, follower) => {
          if (err) {
            console.log("error fetching follower");
            throw err;
          }
          console.log("found follower: " + follower.username);
          if (follower.picture.length > 2) {
            MediaWarehouse.findOne({ id: follower.picture }, (err, data) => {
              if (err) {
                console.log("error in getting picture.");
                throw err;
              }
              let tempPic = "";
              if (data) tempPic = data.data;

              followerArray.push({
                username: follower.username,
                picture: tempPic,
                firstName: follower.firstName,
                lastName: follower.lastName,
              });

              console.log("push success: " + followerArray.length);
            });
          }
        });
      }
      let readyPromise = new Promise(function (resolve, reject) {
        let timeout = (n) => {
          console.log("in timeout: ");
          setTimeout(() => {
            if (followerArray.length === user.followers.length) {
              console.log("responding");
              res.send({ followers: followerArray });
              resolve();
            } else timeout(n);
          }, n);
        };
        timeout(1000);
      });
      readyPromise.then(() => {});
    }
  );
});

app.post("/fetchFollowing", (req, res) => {
  // console.log("in fetch Following: " + req.body.username);
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
          if (following.picture.length > 2) {
            MediaWarehouse.findOne({ id: following.picture }, (err, data) => {
              if (err) {
                console.log("error in getting picture.");
                throw err;
              }
              let tempPic = "";
              if (data) tempPic = data.data;
              followingArray.push({
                username: following.username,
                picture: tempPic,
                firstName: following.firstName,
                lastName: following.lastName,
              });
            });
          }
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
        // console.log(followingArray);
        console.log("responding following");
        res.send({ following: followingArray });
      });
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
  // console.log(req.body);
  const feedArr = [];
  let feedCount = 0;
  for (let i = 0; i < req.body.following.length; i++) {
    Users.findOne({ username: req.body.following[i] }, (err, user) => {
      if (err) throw err;
      feedCount = feedCount + user.publicPosts;
      for (let j = 0; j < user.entries.length; j++) {
        if (user.entries[j].private === false) {
          if (user.picture.length > 2) {
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
          }
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

// app.post("getUserFeed", (req, res) => {
//   const feedArr = [;]
// })

app.post("/getLikes", (req, res) => {
  // console.log(req.body);
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
    if (err) throw err;
    if (data) {
      res.send(data);
    }
  });
  // res.send({ hey: "bro" });
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

// uplaod to mediawarehopuse func make

app.post("/postComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.post }, (err, data) => {
    if (err) {
      console.log("Error in posting comment");
      throw err;
    }
    data.comments.push({
      commentID: uniqid(),
      commentor: req.body.commentor,
      commentorPic: req.body.commentorPic,
      comment: req.body.comment,
      likes: 0,
    });
    data.save();
    res.send({ update: data });
  });
});

app.post("/deleteComment", (req, res) => {
  console.log("deleting comment");
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
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
    res.send({ data: data });
  });
});

app.post("/likeComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
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
    res.send({ data: data });
  });
});

app.post("/unlikeComment", (req, res) => {
  FeedNetwork.findOne({ entryID: req.body.entryID }, (err, data) => {
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
    res.send({ data: data });
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

function uploadToWarehouse(data) {
  //takes data, uploads to warehouse, returns its id
  const newMedia = new MediaWarehouse({
    id: uniqid(),
    data: data,
  });
  newMedia.save();
  return newMedia.id;
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
  console.log("Inside deleteUser");
  Users.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (user) {
      if (user.picture.length > 0) deleteFromWarehouse(user.picture);

      for (let i = 0; i < user.following.length; i++) {
        Users.findOne({ username: user.following[i] }, (err, followingUser) => {
          if (err) throw err;
          if (followingUser) {
            let index = followingUser.followers.indexOf(req.body.username);
            followingUser.followers.splice(index, 1);
            followingUser.save();
          }
        });
      }

      for (let i = 0; i < user.followers.length; i++) {
        Users.findOne({ username: user.followers[i] }, (err, followerUser) => {
          if (err) throw err;
          if (followerUser) {
            let index = followerUser.following.indexOf(req.body.username);
            followerUser.following.splice(index, 1);
            follower.save();
          }
        });
      }

      for (let i = 0; i < user.entries.length; i++) {
        FeedNetwork.findOne(
          { entryID: user.entries[i].entryID },
          (err, feed) => {
            if (err) throw err;
            if (feed) {
              if (feed.comments.length > 0) {
                deleteFromComment(feed.comments);
              }
              FeedNetwork.deleteOne({ entryID: feed })
                .then(function () {
                  console.log("Successfully deleted feed.");
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
        );

        for (let j = 0; j < user.entries[i].image.length; j++) {
          deleteFromWarehouse(user.entries[i].image[j]);
        }
        for (let k = 0; k < user.entries[i].video.length; k++) {
          deleteFromWarehouse(user.entries[i].video[k]);
        }
        for (let l = 0; l < user.entries[i].audio.length; l++) {
          deleteFromWarehouse(user.entries[i].audio[l]);
        }
        if (user.backgroundAudio.length > 0)
          deleteFromWarehouse(user.backgroundAudio);

        // deleteEntry(user.entries[i]);
        // user.entries.splice(i, 1);
      }
    }
  });
  Users.deleteOne({ username: req.body.username })
    .then(function () {
      console.log("Successfully deleted User");
      Network.findOne({}, async (err, result) => {
        console.log("Inside Network");
        if (err) throw err;
        let index = result.users.indexOf(req.body.username);
        result.users.splice(index, 1);
        result.userCount--;
        result.save();
      });
    })
    .catch(function (error) {
      console.log(err);
    });

  console.log("Account succesfully deleted");
  // res.send({mesage: "success"});
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
