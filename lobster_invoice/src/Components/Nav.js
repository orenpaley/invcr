import React, { useState } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./Nav.css";

function Navigation() {
  return (
    <Nav className="d-flex nav">
      <NavItem className="flex-grow-1">
        <NavLink active to="/">
          Home
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink to="/login">Login</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/signup">Signup</NavLink>
      </NavItem>
    </Nav>
  );
}
export default Navigation;
