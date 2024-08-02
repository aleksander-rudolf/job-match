import React, { useEffect, useMemo, useState } from "react";
import { createTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useHistory } from "react-router-dom";
import { EmployerRoutes as routes } from "../routes";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeProvider } from "@emotion/react";
import { Paper, Tooltip } from "@mui/material";

const drawerWidth = 240;

/**
 *
 * @param theme
 * @returns {{overflowX: string, width: number, transition: width}}
 */
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

/**
 *
 * @param theme
 * @returns {{[p: string]: {width: string}, overflowX: string, width: string, transition: width}}
 */
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

/**
 *
 * @type {StyledComponent<MUIStyledCommonProps<Theme>, Pick<JSX.IntrinsicElements[string], keyof JSX.IntrinsicElements[string]>, {}>}
 */

/**
 *
 * @type {StyledComponent<MUIStyledCommonProps<Theme>, JSX.IntrinsicElements[string], {}>}
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/**
 *
 * @type {StyledComponent<Pick<PropsOf<OverridableComponent<AppBarTypeMap>>, keyof React.ComponentProps<OverridableComponent<AppBarTypeMap>>> & MUIStyledCommonProps<Theme>, {}, {}>}
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

/**
 *
 * @type {StyledComponent<Pick<PropsOf<(props: DrawerProps) => JSX.Element>, keyof React.ComponentProps<(props: DrawerProps) => JSX.Element>> & MUIStyledCommonProps<Theme>, {}, {}>}
 */
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Navbar(props) {
  const [toolbarHeader, setToolbarHeader] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkmode") === "true" ? true : false
  );
  const history = useHistory();

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log(props);
    setToolbarHeader(props.navbarHeader);
  }, [props.navbarHeader]);

  /**
   *
   * @type {Theme}
   */
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: "#001E3D",
          light: "#F0F4FA",
          dark: "#001E3D",
        },
        secondary: {
          main: "#65B2FF",
          light: "#e6e9ed",
          dark: "#0A1929",
        },
        sideBarText: {
          main: "black",
          light: "#6f7e86",
          dark: "rgb(178, 186, 194)",
          selectedLight: "#5B96F7",
          selectedDark: "#132f4c",
          hoverLight: "#5B96F7",
          hoverDark: "F0F7FF",
          selectedTextLight: "#FFFFFF",
          selectedTextDark: "#63aefb",
        },
        sideBarIcons: {
          main: "black",
          light: "#6f7e86",
          dark: "rgb(178, 186, 194)",
          selectedLight: "#FFFFFF",
          selectedDark: "#63aefb",
        },
      },
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minWidth: "500px" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          sx={{
            height: "64px",
            boxShadow: 2,
            bgcolor:
              theme.palette.mode === "light"
                ? "secondary.light"
                : "secondary.dark",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
                color:
                  theme.palette.mode === "light"
                    ? "sideBarIcons.light"
                    : "sideBarIcons.dark",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                color:
                  theme.palette.mode === "light"
                    ? "sideBarText.light"
                    : "sideBarText.dark",
              }}
              fontFamily={"IBM Plex Sans"}
              fontWeight="500"
            >
              {toolbarHeader}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              bgcolor:
                theme.palette.mode === "light"
                  ? "secondary.light"
                  : "secondary.dark",
              color:
                theme.palette.mode === "light"
                  ? "sideBarText.light"
                  : "sideBarText.dark",
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {routes.map((route) => (
              <ListItem
                sx={{
                  display: "block",
                }}
                onClick={() => {
                  history.push(route.link);
                  //setToolbarHeader(route.title);
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    borderRadius: "10px",
                    boxShadow:
                      route.title === toolbarHeader
                        ? "0px 2px 4px rgba(0, 0, 0, 0.4)"
                        : null,
                    backgroundColor:
                      route.title === toolbarHeader
                        ? theme.palette.mode === "light"
                          ? "sideBarText.selectedLight"
                          : "sideBarText.selectedDark"
                        : null,
                    color:
                      route.title === toolbarHeader
                        ? theme.palette.mode === "light"
                          ? "sideBarText.selectedTextLight"
                          : "sideBarText.selectedTextDark"
                        : null,
                    "&:hover": {
                      backgroundColor:
                        route.title === toolbarHeader
                          ? theme.palette.mode === "light"
                            ? "sideBarText.hoverLight"
                            : "sideBarText.hoverDark"
                          : null,
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                    transition: "box-shadow 0.3s",
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <Tooltip
                    title={route.title}
                    enterDelay={300}
                    enterNextDelay={300}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          route.title === toolbarHeader
                            ? theme.palette.mode === "light"
                              ? "sideBarIcons.selectedLight"
                              : "sideBarIcons.selectedDark"
                            : theme.palette.mode === "light"
                            ? "sideBarIcons.light"
                            : "sideBarIcons.dark",
                      }}
                    >
                      {route.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={route.title}
                    sx={{ opacity: open ? 1 : 0 }}
                    primaryTypographyProps={{
                      fontFamily: "IBM Plex Sans",
                      fontWeight: "650",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem key="darkmode" sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "10px",
                }}
                onClick={() => {
                  setDarkMode(!darkMode);
                  localStorage.setItem("darkmode", !darkMode);
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      theme.palette.mode === "light"
                        ? "sideBarIcons.light"
                        : "sideBarIcons.dark",
                  }}
                >
                  {darkMode ? <DarkModeOutlinedIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={darkMode ? "Dark mode" : "Light mode"}
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    fontFamily: "IBM Plex Sans",
                    fontWeight: "650",
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem key="darkmode" sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "10px",
                }}
                onClick={() => {
                  history.push("/login");
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      theme.palette.mode === "light"
                        ? "sideBarIcons.light"
                        : "sideBarIcons.dark",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Sign Out"
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    fontFamily: "IBM Plex Sans",
                    fontWeight: "650",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 0, minWidth: 0 }}>
          <DrawerHeader />
          <Paper
            sx={{
              boxShadow: "none",
              border: "none",
              borderRadius: 0,
              backgroundColor:
                theme.palette.mode === "light" ? "#e6e9ed" : "#0B1929",
            }}
          >
            {props.children}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
