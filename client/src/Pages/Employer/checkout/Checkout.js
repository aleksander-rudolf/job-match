import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { Alert, Snackbar } from '@mui/material';


/**
 *
 * @type {string[]}
 */
const steps = ['Step 1', 'Step 2', 'Step 3'];

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return <AddressForm />;
//     case 1:
//       return <PaymentForm />;
//     case 2:
//       return <Review />;
//     default:
//       throw new Error('Unknown step');
//   }
// }

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
export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({})
  const [errorLabel, setErrorLabel] = useState(null);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorLabel(null);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm formData={formData}/>;
      case 1:
        return <PaymentForm formData={formData}/>;
      case 2:
        return <Review formData={formData}/>;
      default:
        throw new Error('Unknown step');
    }
  }


  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  /**
   *
   * @returns {Promise<void>}
   */
  const submitJobPost = async () => {
    const HID = localStorage.getItem("userID");
    formData.HID = HID;
    console.log(formData);
    if(!(formData['jobName'] && formData["duration"] && formData["salary"] && formData["description"] && formData["workingHours"] && formData["locations"] && formData["skills"])) {
      setErrorLabel("Please fill out all required fields before submitting the form.")
      return;
    }

    const raw = JSON.stringify(formData);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
			url: `${process.env.REACT_APP_API_URL}/job-posts/create`,
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    /**
     *
     * @type {Response}
     */
    const response = await fetch(`${process.env.REACT_APP_API_URL}/job-posts/create` , requestOptions);
    if(response.status === 200) {
      handleNext();
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar open={errorLabel} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ mb: 3, display: errorLabel ? "" : "none" }}
          >
            {errorLabel}
          </Alert>
        </Snackbar>
      <Container component="main" maxWidth="600px" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }}}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Job Post Created
              </Typography>
              <Typography variant="subtitle1">
                Job Post is created check your jobs section to view job post
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ? <Button
                  variant="contained"
                  onClick={() => submitJobPost()}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Confirm
                </Button> : <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Next
                </Button>}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
