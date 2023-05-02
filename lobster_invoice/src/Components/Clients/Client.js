import React from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Client = () => {
  let { state } = useLocation();
  const [client, setClient] = useState(state.client);
  const { name, email, address } = client;
  console.log("what is client", client);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("etarget", name, value);
    setClient({ ...client, [name]: value });
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
    </div>
  );
};

export default Client;
