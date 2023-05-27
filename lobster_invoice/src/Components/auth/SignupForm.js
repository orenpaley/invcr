import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import "./Login.css";

function SignupForm({ handleChange, user, setUser }) {
  const history = useNavigate();
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newUser = await LobsterApi.register(
      e.target.email.value,
      e.target.password.value,
      e.target.name.value,
      e.target.address.value
    );
    console.log("user Registered", newUser);
    setUser(newUser);
    localStorage.setItem("curr", JSON.stringify(newUser));
  };

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="row g-3 needs-validation"
      noValidate
    >
      <div>
        <div className="col-md-4">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>

        <div className="col-md-4">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="addres"
            name="address"
            onChange={handleChange}
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
      </div>
      <Button color="info" className="button">
        Register
      </Button>
    </form>
  );
}

export default SignupForm;
