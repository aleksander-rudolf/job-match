import { Alert, IconButton, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import UploadIcon from "@mui/icons-material/Upload";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    "&.Mui-focused fieldset": {
      border:
        theme.palette.mode === "dark" ? "2px solid white" : "2px solid black",
    },
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#BABAC2" : null,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.mode === "dark" ? "white" : null,
    },
  },
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18385C" : "white",
  padding: 10,
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.mode === "dark" ? "white" : "#18385C",
  color: theme.palette.mode === "dark" ? "white" : "#18385C",
  padding: 10,
}));

function Apply() {
  const [errorLabel, setErrorLabel] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const [YOF, setYOF] = useState(null);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userID = localStorage.getItem("userID");

      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/profile/jobSeeker/${userID}`,
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/profile/jobSeeker/${userID}`,
        requestOptions
      );
      if (response.status === 200) {
        const responseData = await response.json();
        setData(responseData.results);
      }
    };

    fetchData();
  }, []);

  const handleAdditionalInfoChange = (event) => {
    setAdditionalInfo(event.target.value);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    console.log(file.name);
    setFile(file);
  };

  const handleChange = (event) => {
    setYOF(event.target.value);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorLabel(null);
  };

  const handleSubmit = async (e) => {
    if (!YOF) {
      setErrorLabel(
        "Please fill out all required fields before submitting the form."
      );
      return;
    }
    e.preventDefault();
    const formData = new FormData();
    formData.append("resumeData", file);
    formData.append("JID", location.state.detail.id);
    formData.append("JSID", localStorage.getItem("userID"));
    formData.append("YOF", YOF);
    formData.append("additionalInfo", additionalInfo);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apply`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        history.push('/applications')
      } else {
        setErrorLabel(
          "Error in the application, you cannot apply to the application twice"
        );
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <Box
      sx={{
        p: "40px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "scroll",
      }}
      justifyContent="center"
      alignItems={"center"}
      spacing={0}
    >
      <Box pl={15} pr={15}>
        <Snackbar open={errorLabel} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ mb: 3, display: errorLabel ? "" : "none" }}
          >
            {errorLabel}
          </Alert>
        </Snackbar>

        <Typography variant="h5">SUBMIT YOUR APPLICATION</Typography>
        <Box
          component="form"
          noValidate="false"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
          //

          justifyContent="center"
          alignItems={"center"}
          onFocus={() => setErrorLabel(null)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomPaper sx={{}}>
                <Stack direction={"row"} alignItems="center" spacing={1}>
                  <IconButton size="large" disabled>
                    <BadgeOutlinedIcon fontSize="inherit" />
                  </IconButton>
                  <Stack direction={"column"} spacing={2}>
                    <Typography variant="h4">Résumé</Typography>
                    <Typography>
                      To start your application, upload your resume in English
                      as PDF with a max size of 2 MB.
                    </Typography>
                    <FormControl fullWidth>
                      <input
                        accept="application/pdf"
                        id="pdfDocument"
                        type="file"
                        onChange={handlePdfUpload}
                        hidden
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        <CustomButton
                          variant="outlined"
                          component="label"
                          htmlFor="pdfDocument"
                          startIcon={<UploadIcon />}
                          sx={{
                            width: "fit-content",
                          }}
                        >
                          Upload
                        </CustomButton>

                        {file && (
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 2,
                              display: "inline-block",
                            }}
                          >
                            {file.name}
                          </Typography>
                        )}
                      </Box>
                    </FormControl>
                  </Stack>
                </Stack>
              </CustomPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                name="firstName"
                fullWidth
                id="firstName"
                inputProps={{ autoComplete: "off" }}
                value={data.FirstName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                id="lastName"
                name="lastName"
                inputProps={{ autoComplete: "off" }}
                value={data.LastName}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="email"
                name="email"
                inputProps={{ autoComplete: "off" }}
                value={data.Email}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                name="phoneNumber"
                type="phone"
                id="phoneNumber"
                inputProps={{ autoComplete: "off" }}
                value={data.PhoneNo}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ minWidth: 120, width: "100%" }}>
                <InputLabel
                  required
                  id="demo-simple-select-helper-label"
                  sx={{
                    "&.Mui-focused": {
                      color: "inherit",
                    },
                  }}
                >
                  Years Of Experience
                </InputLabel>
                <CustomSelect
                  required
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={YOF}
                  label="years of experience"
                  onChange={handleChange}
                  name="YOF"
                >
                  <MenuItem value={"less than 3 months"}>
                    less than 3 months
                  </MenuItem>
                  <MenuItem value={"3 to 8 months"}>3 to 8 months</MenuItem>
                  <MenuItem value={"8 to 12 months"}>8 to 12 months</MenuItem>
                  <MenuItem value={"1 year to 5 years"}>
                    1 year to 5 years
                  </MenuItem>
                  <MenuItem value={"1 year to 5 years"}>
                    more than 5 years
                  </MenuItem>
                </CustomSelect>
                <FormHelperText>
                  How many months/years of experience do you have in this
                  industry
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" p={1}>
                Additional Information
              </Typography>
              <CustomTextField
                id="additionalInfo"
                name="additionalInfo"
                label="Add a cover letter"
                fullWidth
                multiline
                minRows={5}
                onChange={handleAdditionalInfoChange}
              />
            </Grid>
          </Grid>

          <Stack direction={"row"} justifyContent={"center"}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#0C92F3",
                ":hover": {
                  bgcolor: "#3a81d3",
                },
              }}
            >
              SUBMIT APPLICATION
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Apply;
