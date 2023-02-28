import React, {useState} from "react";
import {Avatar} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {Button} from "@mui/material";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import Tooltip from "@mui/material/Tooltip";

function Header(props) {
  const [num, setNum] = useState("");

  const handleChange = (event) => {
    setNum(event.target.value);
  };
  return (
    <nav className="navbar navbar-expand-md navbar-dark" id="header">
      <div className="container-fluid navbar-container mx-lg-5 mx-md-3 py-md-2 py-2 mx-2">
        <a className="navbar-brand" href="">
          Journey
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <table className="width-100">
              <tr>
                <td className="table_data">
                  <button type="button" className="btn btn-default" onClick={props.invertCompose}>
                    Compose
                  </button>
                  {/* <Button
                      variant="contained"
                      startIcon={<MapsUgcIcon />}
                    >
                      Compose
                    </Button> */}
                </td>
                <td className="table_data">
                  <a className="nav-link" href="#">
                    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-helper-label">
                        Post
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Post"
                        value={num}
                        onChange={handleChange}
                      >
                        <MenuItem value={1}>Private</MenuItem>
                        <MenuItem value={2}>Public</MenuItem>
                      </Select>
                    </FormControl>
                  </a>
                </td>
                <td>
                  <a className="nav-link" href="#">
                    <Avatar onClick={props.logOut}>
                      <PersonIcon />
                    </Avatar>
                  </a>
                </td>
              </tr>
            </table>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
