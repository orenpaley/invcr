import { useState, useContext } from "react";
import { useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [user, setUser] = useContext(
    userContext || JSON.parse(localStorage.getItem("curr"))
  );

  useEffect(() => {
    const fetchInvoices = async () => {
      setInvoices(await LobsterApi.getInvoices(user.id));
    };
    fetchInvoices();
  }, [user]);
  return (
    <div>
      {invoices.map((i) => (
        <div>{i.clientName}</div>
      ))}
    </div>
  );
};

export default Invoices;
