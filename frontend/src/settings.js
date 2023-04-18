import $ from "jquery";

const backgrounds = ["bkg0", "bkg1", "bkg2", "bkg3", "bkg4", "bkg5", "bkg6"];

export const expressIP = "http://192.168.34.131:8000";

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

export default backgrounds;
