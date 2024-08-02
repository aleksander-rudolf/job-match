import React, { useEffect } from "react";
import EmployeeApplications from "./Employee/Applications";
import ErrorPage from "./ErrorPage";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Applications(props) {
  useEffect(() => {
    document.title =
      localStorage.getItem("role") === "jobSeeker"
        ? "My Applications | JobMatch"
        : "Error: page not found";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeApplications addNavbarHeader={props.addNavbarHeader}/>
  ) : (
    <ErrorPage addNavbarHeader={props.addNavbarHeader}/>
  );
}

export default Applications;
