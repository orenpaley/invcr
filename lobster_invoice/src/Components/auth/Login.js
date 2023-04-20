import LoginForm from "./LoginForm";

function Login({ handleChange, setUser }) {
  return (
    <div className="login-page">
      <LoginForm handleChange={handleChange} setUser={setUser} />
      <div className="filler">
        Don't have an account? <a href="/signup">Register</a>
      </div>
    </div>
  );
}

export default Login;
