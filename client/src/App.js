import React, { useState } from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./Pages/Navbar";
import { Paper } from "@mui/material";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ErrorPage from "./Pages/ErrorPage";
import JobSearch from "./Pages/JobSearch";
import JobPosts from "./Pages/JobPosts";
import Offers from "./Pages/Offers";
import Profile from "./Pages/Profile";
import Applications from "./Pages/Applications";
import JobPost from "./Pages/JobPost";
// import BasicModal from "./Pages/Modal";
import CreateJobPost from "./Pages/CreateJobPost";
import Apply from "./Pages/Apply";
import SignInModal from "./Components/SigninModal";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  const [navbarHeader, setNavbarHeader] = useState("Home");
  const addNavbarHeader = (title) => {
    setNavbarHeader(title);
  }


  return (
    <Router>
      <Paper sx={{ boxShadow: "none", border: "none", borderRadius: 0 }}>
        <Switch>
          <Route path="/login" component={SignIn} />
          <Route path="/register" component={SignUp} />
          <Paper sx={{ boxShadow: "none", border: "none", borderRadius: 0 }}>
            <NavBar navbarHeader={navbarHeader}>
              <SignInModal />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => <JobSearch addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="/job-posts"
                  render={(props) => <JobPosts addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="/job-posts/:jobId"
                  render={(props) => <JobPost addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="/offers"
                  render={(props) => <Offers addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="/profile"
                  render={(props) => <Profile addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="/applications"
                  render={(props) => (
                    <Applications addNavbarHeader={addNavbarHeader} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/new-job-post"
                  render={(props) => (
                    <CreateJobPost addNavbarHeader={addNavbarHeader} {...props} />
                  )}
                />
                <Route
                  exact
                  path="/apply"
                  render={(props) => <Apply addNavbarHeader={addNavbarHeader} {...props} />}
                />
                <Route
                  exact
                  path="*"
                  render={(props) => <ErrorPage addNavbarHeader={addNavbarHeader} {...props} />}
                />
              </Switch>
            </NavBar>
          </Paper>
        </Switch>
      </Paper>
    </Router>
  );
}

export default App;
