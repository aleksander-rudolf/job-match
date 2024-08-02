import React, { useEffect } from "react";
import EmployerOffers from "./Employer/Offers";
import EmployeeOffers from "./Employee/Offers";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Offers(props) {
  useEffect(() => {
    document.title = "Offers | JobMatch";
  }, []);

  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeOffers addNavbarHeader={props.addNavbarHeader} />
  ) : (
    <EmployerOffers addNavbarHeader={props.addNavbarHeader} />
  );
}

export default Offers;
