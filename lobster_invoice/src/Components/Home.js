import Invoice from "./Invoice/Invoice";
// import pdfGenerator from "./Invoice/invoiceHelpers";
import { useLocation } from "react-router-dom";
import userContext from "../userContext";
import { useState, useContext } from "react";
import LobsterApi from "../API/api";
import { useEffect } from "react";

function Home() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("curr"));

  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function getClients() {
      const fetchClients = await LobsterApi.getClients(user.id);
      console.log("clients fetched!!", fetchClients);
      setClients(fetchClients);
      console.log("clients", clients);
    }
    if (user) {
      getClients();
    }
  }, []);

  return <Invoice data={location.state || null} clients={clients || []} />;
  // }
}

export default Home;
