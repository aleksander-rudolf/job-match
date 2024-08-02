import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function ErrorPage({addNavbarHeader}) {
  const history = useHistory();

  useEffect(() => {
    addNavbarHeader("Error");
    document.title =  "Error: page not found"
  }, []);
  
  return (
    <Stack
      sx={{
        p: "40px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
      }}
      justifyContent="center"
      alignItems={"center"}
      spacing={0}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h5" textAlign={"center"}>
        OOPS, THE PAGE YOU ARE LOOKING FOR CAN'T BE FOUND!
      </Typography>
      <Box p={5}>
        <Button
          variant="outlined"
          onClick={() => history.push("/")}
          sx={{
            color: "#5C95F7",
            borderColor: "#5C95F7",
            borderRadius: "15px",
            ":hover" : {
              borderColor: "#5C95F7",
              boxShadow: "10",
            },
          }}
        >
          <Typography variant="h6" textAlign={"center"}>
            BACK TO HOME PAGE
          </Typography>
        </Button>
      </Box>
    </Stack>
  );
}

export default ErrorPage;
