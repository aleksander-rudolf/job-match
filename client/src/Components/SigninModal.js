import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styled from "@emotion/styled";
import { Stack } from "@mui/material";
import { useHistory } from "react-router-dom";

/**
 *
 * @type {StyledComponent<PropsOf<OverridableComponent<BoxTypeMap<{}, "div", Theme>>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18385C" : "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
}));

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function SignInModal() {

  const [open, setOpen] = useState(false);

  /**
   *
   * @type {History<LocationState>}
   */
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("userID") === null || localStorage.getItem("userID") === "undefined") {
      setOpen(true);
    }
  }, []);

  return (
    <div>
      <Modal
        open={open}
        //onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(5px)" }}
        disableAutoFocus
      >
        <CustomBox sx={{ p: 4, boxShadow: 19 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            YOU ARE NOT LOGGED IN
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Click on the "login" button to Sign-in / Sign-up
          </Typography>
          <Stack
            direction={"row"}
            sx={{ mt: "30px" }}
            justifyContent={"space-between"}
          >
            <Box></Box>
            <Button
              onClick={() => history.push('/login')}
              variant="contained"
              sx={{
                bgcolor: "#649AF7",
                ":hover": {
                  bgcolor: "#3a81d3",
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </CustomBox>
      </Modal>
    </div>
  );
}
