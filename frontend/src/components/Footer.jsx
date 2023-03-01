import React, {useState, useEffect} from "react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ReactWeather, { useOpenWeather } from 'react-open-weather';
export default function Footer(props) {

  const now = new Date().toDateString();
  const [time, setTime] = useState(now);

  function updateTime() {
    setTime(new Date().toDateString());
  }
  //API Key: 45014d735557d276c6086a85e85ce49b
  return (
    <div className="footer px-5" id="footer">
      <ReactWeather />
      <span className="date-p">{time}</span>
      <span className="date-p mx-2">|</span>
      <span className="date-p me-1">
        <CloudOutlinedIcon />
      </span>
      <span className="date-p">cloudy</span>
      {/* {props.api.weather[0].description} */}
      <span className="date-p mx-2">|</span>
      <span className="date-p">
        <label htmlFor="files">
          <AttachFileOutlinedIcon fontSize="small"></AttachFileOutlinedIcon>
        </label>
      </span>
    </div>
  );
}

// <AppBar
//   position="fixed"
//   sx={{ top: "auto", bottom: 0, backgroundColor: "#17263f" }}
//   style={{
//     height: "25px",
//   }}
// >
//   <div className="container-fluid mx-5 width-100">
//     <span className="date-p">13th February, 2023</span>
//     <IconButton color="inherit">
//       <MenuIcon />
//     </IconButton>
//     <IconButton color="inherit">
//       <SearchIcon />
//     </IconButton>
//     <IconButton color="inherit">
//       <MoreIcon />
//     </IconButton>
//   </div>

/* <Toolbar>
        <IconButton color="inherit" aria-label="open drawer">
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit">
          <MoreIcon />
        </IconButton>
      </Toolbar> */
