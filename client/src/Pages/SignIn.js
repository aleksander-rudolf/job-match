import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';


/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/University-Of-Calgary-Software-Projects"
      >
        University Of Calgary Software Projects
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

/**
 *
 * @type {Theme}
 */
const theme = createTheme();

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function SignIn() {

  /**
   *
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [textFieldError, setTextFieldError] = useState(false);

  /**
   *
   * @type {History<LocationState>}
   */
  const history = useHistory();


  useEffect(() => {
    document.title = "Login | JobMatch";
    const handleLogout = () => {
      localStorage.removeItem("role");
      localStorage.removeItem("userID");;
    }

    handleLogout()
  }, []);


  /**
   *
   * @param event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = {
      username: data.get('username'),
      password: data.get('password'),
    };
    /**
     *
     * @type {string}
     */
    const raw = JSON.stringify(login);


    /**
     *
     * @type {Headers}
     */
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    /**
     *
     * @type {{redirect: string, headers: Headers, method: string, body: string, url: string}}
     */
    let requestOptions = {
			url: `${process.env.REACT_APP_API_URL}/login`,
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    /**
     *
     * @type {Response}
     */
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login` , requestOptions);
    if(response.status === 200) {
      let result = await response.json();
      setTextFieldError(false);
      localStorage.setItem('role', result.login_details.role);
      localStorage.setItem('userID', result.login_details.ID);
      history.push(result.login_details.role === 'jobSeeker'? "/" : "/job-posts");
    } else {
      setTextFieldError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              error={textFieldError}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              error={textFieldError}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="./#/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}