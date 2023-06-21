import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { useContext, useState } from "react";
import userContext from "../../userContext";

function ClientForm({ clients, setClients }) {
  const navigate = useNavigate();

  const [context, setContext] = useContext(userContext);
  const [client, setClient] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClient({ ...client, [name]: value });
  };
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (context) {
      const newClient = await LobsterApi.addClient(context.user.id, client);
      setClients([...clients, newClient]);
      navigate("/clients");
    }
  };

  return (
    <form onSubmit={handleClientSubmit} className="signup_form">
      <div className="signup_inputs">
        <div className="signup_input">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="signup_input">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="signup_input">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
            style={{ backgroundColor: "pink !important" }}
            required
          />
        </div>
        <div className="signup_input">
          <Button color="info" className="button regis-button">
            Add Client
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ClientForm;
