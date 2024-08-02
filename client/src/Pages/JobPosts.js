import React, { useEffect } from "react";
import EmployerJobPosts from "./Employer/JobPost";
import EmployeeJobPosts from "./Employee/JobPosts";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function JobPosts(props) {
  useEffect(() => {
    document.title =
      localStorage.getItem("role") === "jobSeeker"
        ? "Jobs | JobMatch"
        : "Home | JobMatch";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeJobPosts addNavbarHeader={props.addNavbarHeader}/>
  ) : (
    <EmployerJobPosts addNavbarHeader={props.addNavbarHeader}/>
  );
}

export default JobPosts;
