import React, { useContext, useEffect, useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";

import LobsterApi from "../../API/api";
import { useNavigate } from "react-router-dom";
import userContext from "../../userContext";

import "./Profile.css";

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
    <>
      <div className="profile_page">
        <FormGroup className="profile_form">
          <Label style={{ padding: "0", margin: "0" }} for="name">
            Name
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={profile.name}
            onChange={handleChange}
          />

          <Label style={{ padding: "0", margin: "0" }} for="email">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={profile.email}
            onChange={handleChange}
          />
          <div>
            <Label style={{ padding: "0", margin: "0" }} for="address">
              Address
            </Label>
          </div>
          <textarea
            style={{ backgroundColor: "#FFE2E2" }}
            type="text"
            name="address"
            id="address"
            value={profile.address}
            onChange={handleChange}
          />
          <Button onClick={handleSave}>Save</Button>
        </FormGroup>
      </div>
    </>
  );
};

export default Profile;
