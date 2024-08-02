import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Stack } from "@mui/system";
import { Avatar, IconButton, Tooltip, Typography } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from '@mui/icons-material/Logout';
import styled from "@emotion/styled";
import { useHistory } from "react-router-dom";

/**
 *
 * @type {StyledComponent<PropsOf<OverridableComponent<BoxTypeMap<{}, "div", Theme>>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#18385C" : "white",
}));

/**
 *
 * @type {StyledComponent<PropsOf<OverridableComponent<TypographyTypeMap>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const CustomTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#B2BAC2" : "#6F7E86",
}));

/**
 *
 * @type {StyledComponent<PropsOf<((props: ({href: string} & OverrideProps<ExtendButtonBaseTypeMap<ExtendButtonBaseTypeMap<{props: {children?: React.ReactNode, classes?: Partial<IconButtonClasses>, color?: OverridableStringUnion<"inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning", IconButtonPropsColorOverrides>, disabled?: boolean, disableFocusRipple?: boolean, edge?: "start" | "end" | false, size?: OverridableStringUnion<"small" | "medium" | "large", IconButtonPropsSizeOverrides>, sx?: SxProps<Theme>}, defaultComponent: "button"}>>, "a">)) => JSX.Element) & OverridableComponent<ExtendButtonBaseTypeMap<ExtendButtonBaseTypeMap<{props: {children?: React.ReactNode, classes?: Partial<IconButtonClasses>, color?: OverridableStringUnion<"inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning", IconButtonPropsColorOverrides>, disabled?: boolean, disableFocusRipple?: boolean, edge?: "start" | "end" | false, size?: OverridableStringUnion<"small" | "medium" | "large", IconButtonPropsSizeOverrides>, sx?: SxProps<Theme>}, defaultComponent: "button"}>>>> & {theme?: Theme} & {readonly theme?: *}, {}, {}>}
 */
const CustomIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#B2BAC2" : "#6F7E86",
}));


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Profile({addNavbarHeader}) {
  const history = useHistory();
  const [data, setData] = useState({});
  const [name, setName] = useState("");

  useEffect(() => {
    addNavbarHeader("Profile")
    
    const fetchData = async () => {
      const userID = localStorage.getItem('userID');
      let requestOptions = {
        url: `${process.env.REACT_APP_API_URL}/profile/hiringManager/${userID}`,
        method: 'GET',
        redirect: 'follow'
      }

      /**
       *
       * @type {Response}
       */
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/hiringManager/${userID}`, requestOptions);
      if (response.status === 200) {
        const responseData = await response.json() 
        setData(responseData.results)
        setName(`${responseData.results.First_Name} ${responseData.results.Last_Name} `)
      }
  }

  fetchData()
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userID");
    history.push('./login');
  }

  return (
    <Stack
      sx={{
        p: "40px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "scroll"
      }}
      justifyContent="center"
      alignItems={"center"}
      spacing={0}
    >
      <CustomBox
        sx={{
          width: 500,
          boxShadow: 3,
          marginBottom: 10,
          borderRadius: "20px",
        }}
      >
        <Stack alignItems={"center"} p={4} spacing={2}>
          <Avatar
            sx={{
              width: "120px",
              height: "120px",
              boxShadow: 6,
            }}
          >
            <img
              src={`https://avatars.dicebear.com/api/initials/${name}.svg?scale=110`}
              alt="initials"
            />
          </Avatar>

          <CustomTypography variant="h3">{`${data.First_Name} ${data.Last_Name} `}</CustomTypography>
          
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <CustomTypography variant="h6" fontWeight={"bold"}>
              Username
            </CustomTypography>
            <CustomTypography>{data.UserName}</CustomTypography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <CustomTypography variant="h6" fontWeight={"bold"}>
              Company
            </CustomTypography>
            <CustomTypography>{data.Business_Name}</CustomTypography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <CustomTypography variant="h6" fontWeight={"bold"}>
              Industry
            </CustomTypography>
            <CustomTypography>{data.Business_Industry}</CustomTypography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            p={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Tooltip
              title="view job posts"
              enterDelay={500}
              enterNextDelay={500}
            >
              <CustomIconButton
                size="large"
                sx={{
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 7,
                    bgcolor: "inherit",
                  },
                }}
                onClick={() => history.push("/job-posts")}
              >
                <WorkIcon fontSize="inherit" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip
              title="create new job post"
              enterDelay={500}
              enterNextDelay={500}
            >
              <CustomIconButton
                size="large"
                sx={{
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 7,
                    bgcolor: "inherit",
                  },
                }}
                onClick={() => history.push("/new-job-post")}
              >
                <CreateIcon fontSize="inherit" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip
              title="view offers"
              enterDelay={1000}
              enterNextDelay={1000}
            >
              <CustomIconButton
                size="large"
                sx={{
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 7,
                    bgcolor: "inherit",
                  },
                }}
                onClick={() => history.push("/offers")}
              >
                <LocalOfferOutlinedIcon fontSize="inherit" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip
              title="sign out"
              enterDelay={500}
              enterNextDelay={500}
            >
              <CustomIconButton
                onClick={() => handleLogout()}
                size="large"
                sx={{
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 7,
                    bgcolor: "inherit",
                  },
                }}
                //onClick={() => history.push("/job-posts")}
              >
                <LogoutIcon fontSize="inherit" />
              </CustomIconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CustomBox>
    </Stack>
  );
}

export default Profile;
