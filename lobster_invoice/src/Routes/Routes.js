import React from "react";

import { Route, Routes, Navigate } from "react-router";
import PrivateRoute from "../helpers/PrivateRoute";

import Home from "../Components/Home";
import Signup from "../Components/auth/Signup";
import Login from "../Components/auth/Login";
import Invoices from "../Components/Invoices/Invoices";
import Clients from "../Components/Clients/Clients";
import Client from "../Components/Clients/Client";
import Logout from "../Components/Logout";
import ErrorPage from "../Components/ErrorPage";

function LobsterRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client" element={<Client />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/redirect" element={<Navigate to="/error-page" />} />
      </Routes>
    </div>
  );
}
export default LobsterRoutes;
