import React from "react";

import "./Clients.css";
import { Table, Button } from "reactstrap";

import { useState, useContext } from "react";
import { useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { NavLink, Navigate } from "react-router-dom";
import ClientForm from "./ClientForm";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [context, setContext] = useContext(userContext);
  // const [user, setUser] = useState(context.user);
  const [add, setAdd] = useState(false);

  const fetchClients = async () => {
    setClients(await LobsterApi.getClients(context.user.id));
  };

  useEffect(() => {
    if (context.user && context.user.id) {
      fetchClients();
    }
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setAdd(!add);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await LobsterApi.deleteClient(context.user.id, e.target.value);
      fetchClients();
    } catch (e) {
      console.error(e, "could not delete Client");
    }
  };

  useEffect(() => {
    if (context.user && context.user.id) {
      fetchClients();
    }
  }, [clients.length]);

  if (!context.user) {
    return <Navigate to="/error-page" replace />;
  }
  return (
    <>
      <Table
        hover
        style={{
          maxWidth: "600px",
          margin: "auto",
          color: "red !important",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client.id}>
              <td>
                <NavLink
                  className="darktable"
                  to="/client"
                  state={{ client }}
                  user={context.user}
                >
                  {client.name}
                </NavLink>
              </td>
              <td>{client.email}</td>
              <td>{client.address}</td>
              <td>
                <Button color="danger" onClick={handleDelete} value={client.id}>
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <Button primary onClick={handleAdd}>
          Add Client
        </Button>
      </div>
      {add && (
        <div className="add_client_form">
          <ClientForm clients={clients} setClients={setClients} />
        </div>
      )}
    </>
  );
};
export default Clients;
