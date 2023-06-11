import React from "react";

import { Route, Routes, Navigate } from "react-router";

import Home from "../Components/Home";
import Signup from "../Components/auth/Signup";
import Login from "../Components/auth/Login";
import Invoices from "../Components/Invoices/Invoices";
import Clients from "../Components/Clients/Clients";
import Client from "../Components/Clients/Client";
import Logout from "../Components/Logout";
import ErrorPage from "../Components/ErrorPage";
import SendMail from "../Components/Invoice/SendMail";
import ClientInvoice from "../Components/ClientInvoice/ClientInvoice";
import { useLocation } from "react-router-dom";

function LobsterRoutes() {
  const location = useLocation();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client" element={<Client />} />
        <Route path="/send" element={<SendMail />} />
        <Route
          path="/client-invoice/:userId/:invoiceId"
          element={<ClientInvoice url={window.location.pathname} />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/redirect" element={<Navigate to="/error-page" />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}
export default LobsterRoutes;
