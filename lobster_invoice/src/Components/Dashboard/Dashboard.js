import React, { useState, useContext, useEffect } from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { useLocation } from "react-router-dom";
import { Table, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location);
  const [context, setContext] = useContext(userContext);
  const [user, setUser] = useState(context.user);
  const [invoices, setInvoices] = useState([]);
  const [activeInvoice, setActiveInvoice] = useState(null);

  useEffect(() => {
    async function getInvoices() {
      if (context) {
        let fetched = await LobsterApi.getInvoices(user.id);
        return fetched;
      }
      return []; // Add a default return value
    }

    async function fetchInvoices() {
      if (invoices.length < 1) {
        let fetched = await getInvoices();
        setInvoices(fetched);
        console.log("invoices set", fetched);
      }
    }

    fetchInvoices();
  }, []);

  const handleInvoiceClick = (invoice) => {
    setActiveInvoice(invoice);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-list-container">
        <div className="invoice-list">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className={`invoice-item ${
                activeInvoice === invoice ? "active" : ""
              }`}
              onClick={() => handleInvoiceClick(invoice)}
            >
              {invoice.code}
            </div>
          ))}
        </div>
      </div>
      <div className="invoice-details-container">
        <div className="invoice-details">
          {activeInvoice ? (
            <div>
              {
                <div className="client-invoice">
                  <div className="topcontainer">
                    <div className="subcontainer header">
                      <div className="dashboard_top_row">
                        <Button
                          onClick={() => {
                            navigate("/", { state: activeInvoice });
                          }}
                        >
                          Open
                        </Button>
                        <div className="dash_status">
                          {activeInvoice.status || "error getting status"}
                        </div>
                      </div>
                      <h3 className="label">Invoice</h3>
                      <p>{activeInvoice.code}</p>
                      <p>Date: {activeInvoice.date}</p>
                      <p>Due Date: {activeInvoice.dueDate}</p>
                    </div>
                    <div className="subcontainer billing-info">
                      <h3 className="label">Billing Information</h3>
                      <p>{activeInvoice.name}</p>
                      <p>{activeInvoice.address}</p>
                      <p>{activeInvoice.email}</p>
                    </div>

                    <div className="subcontainer client-info">
                      <h3 className="label">Client Information</h3>
                      <p>{activeInvoice.clientName}</p>
                      <p>{activeInvoice.clientAddress}</p>
                      <p>{activeInvoice.clientEmail}</p>
                    </div>
                  </div>
                  <div className="items">
                    <h3 style={{ margin: "auto", textAlign: "center" }}>
                      Items
                    </h3>
                    <Table>
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Rate</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.description}</td>
                            <td>${item.rate}</td>
                            <td>{item.quantity}</td>
                            <td>${item.rate * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="footer">
                    <p>Subtotal: ${activeInvoice.subtotal}</p>
                    <p>Tax : ${activeInvoice.taxRate}</p>
                    <p>Total: ${activeInvoice.total}</p>
                  </div>
                  <div className="terms">
                    <h3>Terms</h3>
                    <p>{activeInvoice.terms}</p>
                  </div>
                  <div className="notes">
                    <h3>Notes</h3>
                    <p>{activeInvoice.notes}</p>
                  </div>
                </div>
              }
            </div>
          ) : (
            <p>Select an invoice to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
