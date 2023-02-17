import * as React from "react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import IconButton from "@mui/material/IconButton";
import { Icon } from "@mui/material";

export default function Footer() {
  return (
    <div className="footer px-5" id="footer">
      <span className="date-p">13th February, 2023</span>
      <span className="date-p mx-2">|</span>
      <span className="date-p me-1">
        <CloudOutlinedIcon />
      </span>
      <span className="date-p">Cloudy</span>
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
