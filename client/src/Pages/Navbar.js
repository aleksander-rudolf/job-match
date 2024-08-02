import React from "react";
import EmployerNavbar from './Employer/Navbar';
import EmployeeNavbar from './Employee/Navbar';


/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function NavBar(props) {
  return localStorage.getItem("role") === "jobSeeker" ? (
    <EmployeeNavbar navbarHeader={props.navbarHeader}>{props.children}</EmployeeNavbar>
  ) : (
    <EmployerNavbar navbarHeader={props.navbarHeader}>{props.children}</EmployerNavbar>
  );
}

export default NavBar;
