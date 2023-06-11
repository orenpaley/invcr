import React from "react";
import { Route, Navigate } from "react-router-dom";
import userContext from "../userContext";
import ErrorPage from "../Components/ErrorPage";
/** "Higher-Order Component" for private routes.
 *
 * In routing component, use these instead of <Route ...>. This component
 * will check if there is a valid current user and only continues to the
 * route if so. If no user is present, redirects to login form.
 */

function PrivateRoute({ path, element }) {
  let currUser = React.useContext(userContext);

  console.debug(
    "PrivateRoute",

    "path=",
    path,
    "currentUser=",
    currUser
  );
  if (!currUser) {
    return <Navigate to="/error-page" />;
  }

  return <Route to={path} element={element} />;
}

export default PrivateRoute;
