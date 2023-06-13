import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function LoginForm({ handleChange, user, setUser }) {
  const history = useNavigate();

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
      className="row g-3 needs-validation login-form"
      noValidate
    >
      <div className="flex-container-login">
        <div className="login-field">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control login-input"
            id="email"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="login-field">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control login-input"
            id="password"
            onChange={handleChange}
            required
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="login-field">
          <button className="btn login-button">Login</button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
