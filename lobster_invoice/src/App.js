import "./App.css";
import { useState, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import Navigation from "./Components/Nav";
import LobsterRoutes from "./Routes/Routes";
import LobsterApi from "./API/api";
import userContext from "./userContext";

// import background from "./starrysky.jpeg";

function App() {
  const [context, setContext] = useState(false);
  useEffect(() => {
    const getLoggedUser = async () => {
      if (localStorage.getItem("curr")) {
        setContext(JSON.parse(localStorage.getItem("curr")));
      } else {
        setContext({ user: null, token: null });
      }
    };
    getLoggedUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("curr")
      ? localStorage.getItem("curr").token
      : null;
    LobsterApi.token = token;
  }, [context.token]);

  return (
    <BrowserRouter>
      <userContext.Provider value={[context, setContext]}>
        <div
          className="App"
          style={{
            // backgroundImage: `url(${background})`,
            backgroundColor: "whitesmoke",
            height: "100%",
            width: "100%",
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
