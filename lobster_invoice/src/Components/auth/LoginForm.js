import LobsterApi from "../../API/api";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { initialValuesClear } from "../Invoice/initialValues";
import { useState, useEffect, useContext } from "react";
import userContext from "../../userContext";

import "./Login.css";

function LoginForm({ handleChange }) {
  const navigate = useNavigate();
  const [context, setContext] = useContext(userContext);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (context.user) setIsLogged(true);
  }, [context.user]);

  useEffect(() => {
    navigateIfLogged();
  }, [isLogged]);

  const navigateIfLogged = () => {
    if (isLogged) {
      navigate("/", { state: initialValuesClear });
      setIsLogged(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { token, user } = await LobsterApi.login(
      e.target.email.value,
      e.target.password.value
    );
    try {
      setContext({ token, user });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="login-form">
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
