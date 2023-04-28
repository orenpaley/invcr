import { useState, useContext } from "react";
import { useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();
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

  const handleOpenInvoice = async (e) => {
    e.preventDefault();
    console.log("invoice clicked", e.target.dataset.code);
    const getInvoiceData = async () => {
      let data = await LobsterApi.getInvoice(user.id, e.target.dataset.code);
      console.log("data", data);
      return data;
    };
    const data = await getInvoiceData();
    console.log("opening invoice with data! ->", data);
    navigate("/", { state: data });
  };
  return (
    <div>
      {invoices.map((i, index) => (
        <div key={index} style={{ backgroundColor: "pink", margin: "10px" }}>
          <div>Client: {i.clientName}</div>
          <div data-code={i.code} onClick={handleOpenInvoice}>
            Invoice Code: {i.code}
          </div>
          <div>Status: {i.status || "created"}</div>
          <div>Due Date: {i.dueDate}</div>
        </div>
      ))}
    </div>
  );
};

export default Invoices;
