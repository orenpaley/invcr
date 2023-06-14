import React, { useContext, useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useLocation } from "react-router-dom";

import { NavLink, Navigate } from "react-router-dom";
import LobsterApi from "../../API/api";
import { useNavigate } from "react-router-dom";
import userContext from "../../userContext";

const Client = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const user = useContext(userContext);

  try {
    const [client, setClient] = useState(location.state.client);

    const { name, email, address } = client;

    const handleChange = (e) => {
      const { name, value } = e.target;

      setClient({ ...client, [name]: value });
    };

    const handleSave = async (e) => {
      console.log("lOCATION", location.state);
      console.log("USER", user);
      e.preventDefault();
      await LobsterApi.updateClient(user[0].id, client.id, {
        name: client.name,
        address: client.address,
        email: client.email,
      });
      navigate("/clients");
    };

    return (
      <div>
        <div>
          <NavLink to="/clients">
            <Button>Back</Button>
          </NavLink>
        </div>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            type="text"
            name="address"
            id="address"
            value={address}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSave}>Save</Button>
      </div>
    );
  } catch (e) {
    return <Navigate to="/error-page" replace />;
  }
};

export default Client;
