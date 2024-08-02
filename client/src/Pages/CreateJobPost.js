import React, { useEffect } from "react";
import ErrorPage from "./ErrorPage";
import EmployerCreateJobPost from "./Employer/CreateJobPost";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function CreateJobPost(props) {
  useEffect(() => {
    document.title =
      localStorage.getItem("role") === "jobSeeker"
        ? "Error: page not found"
        : "Create | JobMatch";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <ErrorPage />
  ) : (
    <EmployerCreateJobPost addNavbarHeader={props.addNavbarHeader}/>
  );
}

export default CreateJobPost;
