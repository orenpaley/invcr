import React from "react";
import {
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useState, useContext } from "react";
import { useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { useNavigate } from "react-router-dom";
import { NavLink, Navigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [user, setUser] = useContext(
    userContext || JSON.parse(localStorage.getItem("curr"))
  );

  useEffect(() => {
    const fetchClients = async () => {
      setClients(await LobsterApi.getClients(user.id));
    };
    fetchClients();
  }, []);

  if (!user) {
    return <Navigate to="/error-page" replace />;
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, index) => (
          <tr key={index}>
            <td>
              <NavLink to="/client" state={{ client }}>
                {client.name}
              </NavLink>
            </td>
            <td>{client.email}</td>
            <td>{client.address}</td>
            <td>{client.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default Clients;
