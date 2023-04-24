import LoginForm from "./LoginForm";
import userContext from "../../userContext";
import { useState, useContext } from "react";
import "./Login.css";

function Login() {
  const [context, setContext] = useContext(userContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const handleLoginChange = (e) => {
    e.preventDefault();
    if (e.target.id === email && !context) {
      setEmail(e.target.value);
    } else if (e.target.id === password && !context) {
      setPassword(e.target.value);
    }
  };

  // const handleSignupChange = (e) => {
  //   e.preventDefault();
  //   if (e.target.id === username) {
  //     setUsername(e.target.value);
  //   } else if (e.target.id === password) {
  //     setPassword(e.target.value);
  //   } else if (e.target.id === firstName) {
  //     setFirstName(e.target.value);
  //   } else if (e.target.id === lastName) {
  //     setLastName(e.target.value);
  //   } else if (e.target.id === email) {
  //     setEmail(e.target.value);
  //   }
  // };
  return (
    <div className="login-page">
      <LoginForm
        handleChange={handleLoginChange}
        user={context}
        setUser={setContext}
      />
      <div className="filler">
        Don't have an account? <a href="/signup">Register</a>
      </div>
    </div>
  );
}

export default Login;
