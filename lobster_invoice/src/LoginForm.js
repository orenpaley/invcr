import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import "./Login.css";

function LoginForm({ handleChange, user, setUser }) {
  const history = useNavigate();
  Input("user in login form!", user);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = await LobsterApi.login(
      e.target.email.value,
      e.target.password.value
    );
    setUser(loggedInUser);
    localStorage.setItem("curr", JSON.stringify(loggedInUser));
    return;
  };
  return (
    <form
      onSubmit={handleLoginSubmit}
      className="row g-3 needs-validation"
      noValidate
    >
      <div className="col-md-4">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="text"
          className="form-control"
          id="email"
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
          onChange={handleChange}
          required
        />
        <div className="valid-feedback">Looks good!</div>
      </div>
      <Button color="info" className="button">
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
