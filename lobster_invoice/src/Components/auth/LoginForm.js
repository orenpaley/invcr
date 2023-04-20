import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

function LoginForm() {
  const history = useNavigate();
  const handleChange = (e) => {
    e.preventDefault();
    console.log("key entered - ", e.target.value);
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const currentUser = await LobsterApi.login(
      e.target.email.value,
      e.target.password.value
    );
    localStorage.setItem("currUser", currentUser);
    history.push("/");
    history.go(0);
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
