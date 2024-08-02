import React, { useEffect } from "react";
import ErrorPage from "./ErrorPage";
import JobApplicants from "./Employer/JobApplicants";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function JobPost(props) {
  useEffect(() => {
    document.title =
      localStorage.getItem("role") === "jobSeeker"
        ? "Error: page not found"
        : "Applicants | JobMatch";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <ErrorPage addNavbarHeader={props.addNavbarHeader}/>
  ) : (
    <JobApplicants addNavbarHeader={props.addNavbarHeader}/>
  );
}

export default JobPost;
