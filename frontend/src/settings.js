import $ from "jquery";

const backgrounds = ["bkg0", "bkg1", "bkg2", "bkg3", "bkg4", "bkg5", "bkg6"];

export const expressIP = "http://192.168.34.130:8000";

export const defaultEntry = {
  entryID: "",
  owner: "",
  title: "",
  content: "",
  media: {
    image: [],
    video: [],
    audio: [],
  },
  backgroundAudio: "",
  backgroundImage: "",
  date: "",
  weather: {
    desc: "",
    icon: "",
  },
  shared: [],
  private: true,
  lastModifiedBy: "",
  owner: "",
};

export const loadControl = {
  setMouseLoading: () => {
    console.log("setting mouse loading");
    $("*").css("cursor", "progress");
    $("#noneShallPass").css("display", "block");
  },

  setMouseNormal: () => {
    $("*").css("cursor", "default");
    $("#noneShallPass").css("display", "none");
  },
};

export const welcomeEntry = {
  creator: {
    email: "journey@mail.com",
    firstName: "Journey",
    followers: [],
    following: [],
    lastName: "",
    picture: "",
    username: "Journey",
  },
  entry: {
    entryID: "1o9fam8lh3hyb36",
    owner: "journey2allmankind",
    size: 584,
    title: "Welcome to Journey!!!!!",
    content:
      "You are currently not following anybody.\nCheck out your profile page, and follow other writers to see their public posts.\n\nYou can create your own stories by clicking on the Compose button.\n\nThis world is full of beautiful stories, come tell us yours.",
    media: {
      image: [],
      video: [],
      audio: [],
    },
    backgroundAudio: "",
    backgroundImage: "",
    date: "Sun Apr 30 2023",
    weather: {
      desc: "Clouds",
      icon: "04n",
    },
    private: true,
    shared: [],
    lastModifiedBy: "journey2allmankind",
    lastModified: 1682864298357,
  },
};

export default backgrounds;
