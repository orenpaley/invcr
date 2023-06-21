import SignupForm from "./SignupForm";
import userContext from "../../userContext";
import { useState, useContext } from "react";

function Signup() {
  const [user, setUser] = useState(userContext);
  return (
    <>
      <SignupForm user={user} setUser={setUser} />
      <div className="filler">
        Already registered? <a href="/login">Log In</a>
      </div>
    </>
  );
}
export default Signup;
