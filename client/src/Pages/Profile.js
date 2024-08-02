import React, { useEffect } from "react";
import EmployeeProfile from "./Employee/Profile";
import EmployerProfile from "./Employer/Profile";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Profile(props) {
  useEffect(() => {
    document.title = "Profile | JobMatch";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeProfile addNavbarHeader={props.addNavbarHeader} />
  ) : (
    <EmployerProfile addNavbarHeader={props.addNavbarHeader} />
  );
}

export default Profile;
