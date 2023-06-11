import Invoice from "./Invoice/Invoice";
// import pdfGenerator from "./Invoice/invoiceHelpers";
import { useInput } from "react-router-dom";
import { useState } from "react";
import LobsterApi from "../API/api";
import { useEffect } from "react";

function Home() {
  const Input = useInput();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function getClients() {
      const fetchClients = await LobsterApi.getClients(Input.state.userId);
      setClients(fetchClients);
    }
    if (Input.state) {
      getClients();
    }
  }, [Input.state]);

  return <Invoice data={Input.state || null} clients={clients} />;
  // }
}

export default Home;
