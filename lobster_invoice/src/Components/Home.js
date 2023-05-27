import Invoice from "./Invoice/Invoice";
// import pdfGenerator from "./Invoice/invoiceHelpers";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import LobsterApi from "../API/api";
import { useEffect } from "react";

function Home() {
  const location = useLocation();
  const [clients, setClients] = useState([]);
  console.log("LOCATION", location);

  useEffect(() => {
    async function getClients() {
      const fetchClients = await LobsterApi.getClients(location.state.userId);
      setClients(fetchClients);
    }
    if (location.state) {
      getClients();
    }
  }, [location.state]);

  return <Invoice data={location.state || null} clients={clients} />;
  // }
}

export default Home;
