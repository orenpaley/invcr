import Invoice from "./Invoice/Invoice";
// import pdfGenerator from "./Invoice/invoiceHelpers";
import { useLocation } from "react-router-dom";
import userContext from "../userContext";
import { useState, useContext } from "react";
import LobsterApi from "../API/api";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

function Home() {
  const location = useLocation();
  const [context, setContext] = useContext(userContext);
  const [user, setUser] = useState(context.user);

  useEffect(() => {
    async function checkToken() {
      if (localStorage.getItem("token")) {
        const decoded = jwt_decode(localStorage.getItem("token"));
        const tokenUser = await LobsterApi.getUser(decoded.id);
        setUser(tokenUser);
      }
    }
    checkToken();
  }, [user]);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function getClients() {
      const fetchClients = await LobsterApi.getClients(user.id);
      setClients(fetchClients);
    }
    if (user && user.id) {
      getClients();
    }
  }, [user]);

  return <Invoice data={location.state || null} clients={clients || []} />;
  // }
}

export default Home;
