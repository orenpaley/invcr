import React from "react";

import { Route, Routes } from "react-router";
import PrivateRoute from "../helpers/PrivateRoute";

import Home from "../Components/Home";
import Signup from "../Components/auth/Signup";
import Login from "../Components/auth/Login";
import Invoices from "../Components/Invoices/Invoices";

function LobsterRoutes({ user }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </div>
  );
}
export default LobsterRoutes;
