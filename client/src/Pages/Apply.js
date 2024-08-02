import React, { useEffect } from "react";
import ErrorPage from "./ErrorPage";
import EmployeeApply from "./Employee/Apply";

function Apply(props) {
  useEffect(() => {
    document.title =
      localStorage.getItem("role") === "jobSeeker"
        ? "Apply | JobMatch"
        : "Error: page not found";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeApply addNavbarHeader={props.addNavbarHeader}/>
  ) : (
    <ErrorPage />
  );
}

export default Apply;
