import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function List(props) {
  return (
    <div>
      {props.data.map((file, index) => {
        return (
          <div key={index} className="row">
            <div className="col-lg-10">
              <audio controls className="audio-player" id={"m" + index}>
                <source src={file} type="audio/mpeg" id={"m" + index}></source>
              </audio>
            </div>
            {props.createMode ? (
              <div className="col-lg-1">
                <IconButton
                  className="mx-auto"
                  onClick={() => {
                    props.deleteMedia("audio", index);
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "white" }} />
                </IconButton>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default List;

// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import SkipNextIcon from '@mui/icons-material/SkipNext';

// export default function List() {
//   const theme = useTheme();

//   return (
//     <Card sx={{ display: 'flex' }}>
//       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//         <CardContent sx={{ flex: '1 0 auto' }}>
//           <Typography component="div" variant="h5">
//             Live From Space
//           </Typography>
//         </CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
//           <IconButton aria-label="previous">
//             {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
//           </IconButton>
//           <IconButton aria-label="play/pause">
//             <PlayArrowIcon sx={{ height: 38, width: 38 }} />
//           </IconButton>
//           <IconButton aria-label="next">
//             {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
//           </IconButton>
//         </Box>
//       </Box>
//     </Card>
//   );
// }
