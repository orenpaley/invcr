import "./App.css";
import { useState, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import Navigation from "./Components/Nav";
import LobsterRoutes from "./Routes/Routes";
import LobsterApi from "./API/api";
import userContext from "./userContext";

import background from "./starrysky.jpeg";

function App() {
  const [context, setContext] = useState({});
  const [token, setToken] = useState(
    localStorage.getItem("token") || { token: null }
  );

  useEffect(() => {
    const getLoggedUser = async () => {
      if (localStorage.getItem("curr")) {
        setContext(JSON.parse(localStorage.getItem("curr")));
      } else if (token) {
        LobsterApi.token = token;
        const loggedInUser = await LobsterApi.getUser(context.userId);
        setContext(loggedInUser);
      } else {
        setContext(false);
      }
    };
    getLoggedUser();
  }, []);

  return (
    <BrowserRouter>
      <userContext.Provider value={[context, setContext]}>
        <div
          className="App"
          style={{
            backgroundImage: `url(${background})`,
            backgroundColor: "red",
          }}
        >
          <Navigation />
          <LobsterRoutes />
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
