import "./App.css";
import { useState, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import Navigation from "./Components/Nav";
import LobsterRoutes from "./Routes/Routes";
import LobsterApi from "./API/api";
import userContext from "./userContext";
import jwt_decode from "jwt-decode";

function App() {
  const [context, setContext] = useState({});
  const [token, setToken] = useState(
    localStorage.getItem("token") || { token: null }
  );

  useEffect(() => {
    const getLoggedUser = async () => {
      console.log("token", token);

      if (localStorage.getItem("curr")) {
        setContext(JSON.parse(localStorage.getItem("curr")));
        console.log("context set?", context);
      } else if (token) {
        let decoded = jwt_decode(token);
        console.log("token", token);
        console.log("decoded", decoded);
        LobsterApi.token = token;
        const loggedInUser = await LobsterApi.getUser(context.userId);
        setContext(loggedInUser);
        console.log("curr user check", context);
      }
    };
    getLoggedUser();
  }, []);

  // const handleSignupChange = (e) => {
  //   e.preventDefault();
  //   if (e.target.id === email) {
  //     setNewUser({ ...user, [e.target.id]: email });
  //   } else if (e.target.id === password) {
  //     setPassword(e.target.value);
  //   } else if (e.target.id === firstName) {
  //     setFirstName(e.target.value);
  //   } else if (e.target.id === lastName) {
  //     setLasttName(e.target.value);
  //   } else if (e.target.id === email) {
  //     setEmail(e.target.value);
  //   }
  // };

  return (
    <BrowserRouter>
      <userContext.Provider value={[context, setContext]}>
        <div className="App">
          <Navigation />
          <LobsterRoutes />
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
