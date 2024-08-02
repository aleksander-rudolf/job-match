import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TagsInput from "../Components/TagsInput";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  Alert,
  Snackbar,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useHistory } from "react-router-dom";

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
export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState(null);
  const [errorLabel, setErrorLabel] = useState(null);
  const history = useHistory();

  useEffect(() => {
    document.title = "Register | JobMatch";
  }, []);

  /**
   *
   * @param event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    console.log(role);
    event.preventDefault();

    /**
     *
     * @type {FormData}
     */
    const data = new FormData(event.currentTarget);

    /**
     *
     * @type {{skills: string, firstName: FormDataEntryValue, lastName: FormDataEntryValue, password: FormDataEntryValue, role: FormDataEntryValue, phoneNumber: FormDataEntryValue, location: FormDataEntryValue, email: FormDataEntryValue, username: FormDataEntryValue}|{firstName: FormDataEntryValue, lastName: FormDataEntryValue, password: FormDataEntryValue, role: FormDataEntryValue, businessName: FormDataEntryValue, businessIndustry: FormDataEntryValue, email: FormDataEntryValue, username: FormDataEntryValue}}
     */
    const formInput =
      role === "jobSeeker"
        ? {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            username: data.get("username"),
            password: data.get("password"),
            role: data.get("role"),
            phoneNumber: data.get("phoneNumber"),
            location: data.get("location"),
            skills: skills
          }
        : {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            username: data.get("username"),
            password: data.get("password"),
            role: data.get("role"),
            businessName: data.get("businessName"),
            businessIndustry: data.get("businessIndustry"),
          };

    const validateJobSeeker = Boolean(
      formInput["role"] === "jobSeeker" &&
        formInput["firstName"] &&
        formInput["lastName"] &&
        formInput["email"] &&
        formInput["username"] &&
        formInput["password"] &&
        formInput["phoneNumber"] &&
        formInput["location"]
    );

    const validateHiringManager = Boolean(
      formInput["role"] === "hiringManager" &&
        formInput["firstName"] &&
        formInput["lastName"] &&
        formInput["email"] &&
        formInput["username"] &&
        formInput["password"] &&
        formInput["businessName"] &&
        formInput["businessIndustry"]
    );

    if (!(validateHiringManager || validateJobSeeker))
      return setErrorLabel(
        "Please fill out all required fields before submitting the form."
      );

    localStorage.setItem("role", formInput.role);
    const raw = JSON.stringify(formInput);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      url: `${process.env.REACT_APP_API_URL}/register`,
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    /**
     *
     * @type {Response}
     */
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/register`,
      requestOptions
    );

    if (response.status === 200) {
      const result = await response.json();
      localStorage.setItem("userID", result.userID);
      history.push("/login");
    } else {
      setErrorLabel(
        "Username or Email already exist use different username and/or email"
      );
    }
  };

  /**
   *
   * @param event
   */
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  /**
   *
   * @param event
   */
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorLabel(null);
  };

  const handleValueChange = async (event, newValue) => {
    setSkills(newValue);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Snackbar
            open={errorLabel}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="error"
              sx={{ mb: 3, display: errorLabel ? "" : "none" }}
            >
              {errorLabel}
            </Alert>
          </Snackbar>
          <Avatar
            sx={{
              m: 1,
              width: "75px",
              height: "75px",
            }}
          >
            <img
              src={`https://avatars.dicebear.com/api/initials/${firstName} ${lastName}.svg?scale=110`}
              alt="initials"
            />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            noValidate="false"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyPress}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ minWidth: 120, width: "100%" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={role}
                    label="Role"
                    onChange={handleChange}
                    name="role"
                    onFocus={() => setErrorLabel(null)}
                  >
                    <MenuItem id="jobSeeker" value={"jobSeeker"}>
                      Job Seeker
                    </MenuItem>
                    <MenuItem id="hiringmanager" value={"hiringManager"}>
                      Hiring Manager
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Will you be using this website as an Employee or Business
                    owner/hiring manager?
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: role === "hiringManager" ? "inline" : "none",
                }}
              >
                <TextField
                  name="businessName"
                  required
                  fullWidth
                  id="businessName"
                  label="Business Name"
                  autoFocus
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: role === "hiringManager" ? "inline" : "none",
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="businessIndustry"
                  label="Business Industry"
                  name="businessIndustry"
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: role === "jobSeeker" ? "inline" : "none",
                }}
              >
                <TextField
                  name="phoneNumber"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  autoFocus
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: role === "jobSeeker" ? "inline" : "none",
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="location"
                  label="Location"
                  name="location"
                  autoComplete="location"
                  onFocus={() => setErrorLabel(null)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: role === "jobSeeker" ? "inline" : "none",
                }}
              >
                <Autocomplete
                  sx={{
                    minWidth: "450px",
                    maxWidth: "500px",
                  }}
                  multiple
                  id="tags-filled"
                  options={[]}
                  freeSolo
                  onChange={handleValueChange}
                  value={skills}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder={skills.length > 0 ? "skills" : "add your skills here"} />
                  )}
                />
                <FormHelperText>
                  Type your skill, then press Enter to add your skill as a tag
                </FormHelperText>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./#/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
