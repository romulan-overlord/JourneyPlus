import { teal } from "@mui/material/colors";
import { textAlign } from "@mui/system";
import * as React from "react";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import logo from "../images/logoSmall.png";

// function Copyright(props) {
//   return (
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       {...props}
//     >
//       {"Copyright © "}
//       <Link color="inherit" href="/">
//         Ritu Raj Pradhan & Vignesh Sham
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const theme = createTheme();

// export default function SignUp(props) {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     const requestData = {
//       firstName: data.get("firstName"),
//       lastName: data.get("lastName"),
//       username: data.get("username"),
//       email: data.get("email"),
//       password: data.get("password"),
//     };
//     fetch("http://localhost:8000/signUp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         props.switch();
//         console.log("Success:", data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <img src={logo} alt="logo.png"></img>

//           <Typography component="h1" variant="h5">
//             Sign up
//           </Typography>
//           <Box
//             component="form"
//             noValidate
//             onSubmit={handleSubmit}
//             sx={{ mt: 3 }}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   autoComplete="given-name"
//                   name="firstName"
//                   required
//                   fullWidth
//                   id="firstName"
//                   label="First Name"
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="lastName"
//                   label="Last Name"
//                   name="lastName"
//                   autoComplete="family-name"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="username"
//                   label="Username"
//                   name="username"
//                   autoComplete="username"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   name="password"
//                   label="Password"
//                   type="password"
//                   id="password"
//                   autoComplete="new-password"
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign Up
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Grid item>
//                 <Link onClick={props.switch} href="#" variant="body2">
//                   Already have an account? Sign in
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//         <Copyright sx={{ mt: 5 }} />
//       </Container>
//     </ThemeProvider>
//   );
// }

function SignUp(props) {
  return (
    <div className="container-fluid" >
      <div className="row mx-5">
        <div className="col-md-6">
          <div className="container-fluid px-0 landing-page-title">
            <h1 className="big-heading">Because your Story Matters...</h1>
            <h3 className="text-muted">
              Record your journey as you see fit, perhaps share it with the
              world.
            </h3>
          </div>
        </div>
        <div className="col-md-6 px-5">
          <div className="signup-column col-lg-12 col-md-6">
          <div className="container-fluid px-0 landing-page-title">
              <div className="card set-colour">
                <div className="card-header mx-auto signup-text">
                  <h3>Sign Up</h3>
                </div>
                  <div className="card-body">
                    <div class="container text-center">
                      <div class="row">
                        <div class="col">
                          Column
                        </div>
                        <div class="col">
                          Column
                        </div>
                      </div>
                    </div>
                    <div className="input-group flex-nowrap margin-between-input">
                      <input type="text" className="form-control " placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"></input>
                    </div>

                    <div className="input-group flex-nowrap margin-between-input">
                      <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="addon-wrapping"></input>
                    </div>

                    <div className="input-group flex-nowrap set-colour outline-dark margin-between-input">
                      <input type="text" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping"></input>
                    </div>

                    <div className= "text-center">
                    <button className=" btn btn-lg btn-block btn-outline-dark set-signup-button-colour" type="button">Sign Up</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* <div className="container-fluid px-0">
            <form>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  @
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                />
              </div>
            </form>
            <h1>Because Your Story Matters...</h1>
            <h3 className="text-muted">
              Record your journey as you see fit, perhaps share it with the
              world.
            </h3>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
