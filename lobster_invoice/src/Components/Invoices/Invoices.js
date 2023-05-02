import React from "react";
import { Table, Button } from "reactstrap";

import { useState, useContext } from "react";
import { useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [user, setUser] = useContext(
    userContext || JSON.parse(localStorage.getItem("curr"))
  );

  useEffect(() => {
    const fetchInvoices = async () => {
      setInvoices(await LobsterApi.getInvoices(user.id));
    };
    const fetchClients = async () => {
      setClients(await LobsterApi.getClients(user.id));
    };
    fetchInvoices();
    fetchClients();
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

  const [statuses, setStatuses] = useState([]);

  const options = [
    {
      label: "created",
      value: "created",
    },

    {
      label: "paid",
      value: "paid",
    },

    {
      label: "sent",
      value: "sent",
    },

    {
      label: "overdue",
      value: "overdue",
    },
  ];

  const handleClick = (e) => {
    e.preventDefault();
    console.log("name", e.target.name);
    console.log("e.target.value", e.target.value);

    const { name, value } = e.target;
    const patch = async () => {
      setStatuses({ ...statuses, [name]: value });
      console.log("statuses", statuses);
      await LobsterApi.patchInvoice(user.id, name, { status: value });
      console.log(`status updated ${name} -> ${value}`);
    };
    patch();

    // const res = LobsterApi.patchInvoice(user.id, invoice.code, {
    //   status: status,
    // });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    LobsterApi.deleteInvoice(user.id, e.target.value);
    console.log("deleted invoice -", e.target.value);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th>Invoice Code</th>
          <th>Client Name</th>
          <th>status</th>
          <th>Date</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.code}>
            <th
              data-code={invoice.code}
              onClick={handleOpenInvoice}
              scope="row"
            >
              {invoice.code}
            </th>
            <td>{invoice.clientName}</td>
            <td>
              <select
                caret
                name={invoice.code}
                value={statuses[invoice.code] || invoice.status}
                onChange={handleClick}
              >
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
            </td>
            <td>{invoice.dueDate}</td>
            <td>{invoice.total}</td>
            <Button onClick={handleDelete} value={invoice.code}>
              X
            </Button>
          </tr>
        ))}
        {/* <div>
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
    </div> */}
      </tbody>
    </Table>
  );
};

export default Invoices;
