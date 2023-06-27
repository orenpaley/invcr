import React, { useContext, useEffect, useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { useLocation } from "react-router-dom";

import { NavLink, Navigate } from "react-router-dom";
import LobsterApi from "../../API/api";
import { useNavigate } from "react-router-dom";
import userContext from "../../userContext";

const Profile = () => {
  const navigate = useNavigate();
  const [context, setContext] = useContext(userContext);
  const [user, setUser] = useState(context.user);
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    address: user.address,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await LobsterApi.patchUser(context.user.id, profile);
    setContext({ ...context, user: { ...context.user, ...profile } });
    navigate("/invoices");
  };

  return (
    <div>
      {/* <div>
          <NavLink to="/clients">
            <Button>Back</Button>
          </NavLink>
        </div> */}
      <FormGroup>
        <Label for="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          value={profile.name}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={profile.email}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <div>
          <Label for="address">Address</Label>
        </div>
        <textarea
          style={{ backgroundColor: "#FFE2E2" }}
          type="text"
          name="address"
          id="address"
          value={profile.address}
          onChange={handleChange}
        />
      </FormGroup>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default Profile;
