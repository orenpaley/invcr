import React, { useState, useContext } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import userContext from "../userContext";

function Navigation() {
  const [context, setContext] = useContext(userContext);

  return !context.id ? (
    <>
      <Nav>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{ marginLeft: "24px", fontSize: "36px", fontWeight: 600 }}
          >
            INVCR
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: "36px",
              marginRight: "46px",
              fontSize: "28px",
            }}
          >
            <NavItem>
              <NavLink Input={true} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/signup">Signup</NavLink>
            </NavItem>
          </div>
        </div>
      </Nav>
    </>
  ) : (
    <>
      <Nav>
        <NavItem className="" style={{ paddingLeft: "24px" }}>
          <NavLink Input to="/">
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
    </>
  );
}
export default Navigation;
