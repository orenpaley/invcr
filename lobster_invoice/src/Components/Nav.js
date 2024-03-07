import React, { useContext } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import userContext from "../userContext";

function Navigation() {
  const [context, setContext] = useContext(userContext);

  return !context.token ? (
    <>
      <Nav>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "0",
            margin: "auto",
            width: "75%",
            fontSize: "16px !important",
          }}
        >
          <NavLink
            to="/"
            className={(isActive) =>
              "invcr_logo nav-link" + (!isActive ? " unselected" : "")
            }
            style={{
              marginLeft: "24px",
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            INVCR.io
          </NavLink>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "baseline",
              padding: "0",
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "132px",
              gap: "60px",
              width: "100%",
              fontSize: "16px !important",
            }}
          >
            {/* <NavItem>
              <NavLink
                className={(isActive) =>
                  "nav-link" + (!isActive ? " unselected" : "")
                }
                to="/login"
              >
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={(isActive) =>
                  "nav-link" + (!isActive ? " unselected" : "")
                }
                to="/signup"
              >
                Signup
              </NavLink>
            </NavItem> */}
          </div>
        </div>
      </Nav>
    </>
  ) : (
    <>
      <Nav>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "0",
            margin: "auto",
            width: "75%",
            fontSize: "16px !important",
          }}
        >
          <NavLink
            to="/"
            className={(isActive) =>
              "invcr_logo nav-link" + (!isActive ? " unselected" : "")
            }
            style={{
              marginLeft: "24px",
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            INVCR.io
          </NavLink>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: "60px",
              alignItems: "baseline",
              padding: "0",
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "46px",
              width: "100%",
              fontSize: "16px !important",
            }}
          >
            {/* <NavItem>
              <NavLink
                className={(isActive) =>
                  "nav-link" + (!isActive ? " unselected" : "")
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={(isActive) =>
                  "nav-link" + (!isActive ? " unselected" : "")
                }
                to="/clients"
              >
                Clients
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={(isActive) =>
                  "nav-link" + (!isActive ? " unselected" : "")
                }
                to="/profile"
              >
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/logout">Logout</NavLink>
            </NavItem> */}
          </div>
        </div>
      </Nav>
    </>
  );
}
export default Navigation;
