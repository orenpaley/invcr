import React from "react";

import { Route, Routes } from "react-router";
import PrivateRoute from "../helpers/PrivateRoute";

import Home from "../Components/Home";
import Signup from "../Components/auth/Signup";
import Login from "../Components/auth/Login";
import Invoices from "../Components/Invoices/Invoices";
import Clients from "../Components/Clients/Clients";
import Client from "../Components/Clients/Client";

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
      </Routes>
    </div>
  );
}
export default LobsterRoutes;
