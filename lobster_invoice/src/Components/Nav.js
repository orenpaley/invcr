import React, { useState, useContext } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import userContext from "../userContext";

function Navigation() {
  const [context, setContext] = useContext(userContext);
  console.log("context if logged in", context);

  return !context.id ? (
    <Nav className="d-flex nav">
      <NavItem className="">
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
  ) : (
    <Nav className="d-flex nav">
      <NavItem className="">
        <NavLink active to="/">
          Home
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink to="/invoices">Invoices</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/clients">Clients</NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/logout">Logout</NavLink>
      </NavItem>
    </Nav>
  );
}
export default Navigation;
