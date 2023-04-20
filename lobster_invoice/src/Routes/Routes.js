import React from "react";

import { Route, Routes } from "react-router";
import PrivateRoute from "../helpers/PrivateRoute";

import Home from "../Components/Home";
import Signup from "../Components/auth/Signup";
import Login from "../Components/auth/Login";

function LobsterRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}
export default LobsterRoutes;
