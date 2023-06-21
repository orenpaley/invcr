import React, { useState, useEffect } from "react";
import LobsterApi from "../../API/api";
import { useLocation } from "react-router-dom";
import { initialValuesClear } from "../Invoice/initialValues";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import "./ClientInvoice.css";

import { Table, Button } from "reactstrap";

const ClientInvoice = ({ url }) => {
  const location = useLocation();
  const [values, setValues] = useState(initialValuesClear);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    fetchCi();
  }, []);

  useEffect(() => {
    setSubtotalFunc();
  }, [values]);

  const getItems = () => {
    let items = values.items;
    let itemArr = [];

    items.forEach((item) => {
      let vals = Object.values(item);
      itemArr.push([vals.map((v) => String(v))]);
    });
    return itemArr.flat();
  };

  function setSubtotalFunc() {
    setSubtotal(0);
    values.items.forEach((item) => {
      setSubtotal((subtotal) => (subtotal += +item.rate * +item.quantity));
    });
  }

  async function fetchCi() {
    const urlParams = location.pathname.split("/").reverse();
    const invoiceData = await LobsterApi.getInvoice(urlParams[1], urlParams[0]);
    const fetched = await invoiceData;

    setValues({ ...fetched, items: invoiceData.items });
    setSubtotal();
  }

  const generatePdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add the information for the person sending the invoice
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.name, 20, 25);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.address, 20, 31);

    // Add the "Bill To" section
    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 20, 55);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.clientName, 20, 60);
    doc.setFont(undefined, "normal");
    doc.text(values.clientAddress, 20, 65);

    // Add Invoice Title / Info
    doc.setFontSize(28);
    doc.text("Invoice", 90, 15);
    // invoice #, date, due date
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Invoice Number:", 110, 55);
    doc.text(values.code, 150, 55);

    doc.text("Date:", 110, 63);
    doc.setFont(undefined, "normal");
    doc.text(values.date, 150, 63);

    doc.text("Due Date:", 110, 71);
    doc.setFont(undefined, "normal");
    doc.text(values.dueDate, 150, 71);

    const items = getItems();
    const sliced = [];
    for (let item of items) {
      item.push(+item[4] * +item[5]);
      sliced.push(item.slice(3));
    }

    autoTable(doc, {
      startY: 80,
      head: [["Description", "Rate", "Quantity", "Total"]],
      body: [...sliced],
    });
    let finalY = doc.previousAutoTable.finalY;

    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 140, finalY + 10);
    doc.text(String(subtotal), 170, finalY + 10);

    doc.text("Tax:", 140, finalY + 20);
    doc.text(String(values.taxRate), 170, finalY + 20);

    doc.setFont(undefined, "bold");
    doc.text("Total:", 140, finalY + 30);
    doc.text(String(values.total), 170, finalY + 30);

    doc.text("Terms:", 20, finalY + 10);
    doc.text(String(values.terms), 20, finalY + 20);

    doc.text("Notes:", 20, finalY + 40);
    doc.text(String(values.notes), 20, finalY + 50);
    doc.save("invoice.pdf");

    return doc;
  };

  return (
    <div>
      <Button
        style={{
          margin: "auto",
          display: "block",
          marginTop: "25px",
          marginBottom: "25px",
        }}
        className="btn btn-info downloadBtn"
        onClick={generatePdf}
      >
        Download
      </Button>
      {values ? (
        <div>
          {
            <div className="client-invoice">
              <div className="topcontainer">
                <div className="subcontainer header">
                  <h3 className="label">Invoice</h3>
                  <p>{values.code}</p>
                  <p>Date: {values.date}</p>
                  <p>Due Date: {values.dueDate}</p>
                </div>
                <div className="subcontainer billing-info">
                  <h3 className="label">Billing Information</h3>
                  <p>{values.name}</p>
                  <p>{values.address}</p>
                  <p>{values.email}</p>
                </div>

                <div className="subcontainer client-info">
                  <h3 className="label">Client Information</h3>
                  <p>{values.clientName}</p>
                  <p>{values.clientAddress}</p>
                  <p>{values.clientEmail}</p>
                </div>
              </div>
              <div className="items">
                <h3 style={{ margin: "auto", textAlign: "center" }}>Items</h3>
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
                    {values.items.map((item, index) => (
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
                <p>Subtotal: ${subtotal}</p>
                <p>Tax : ${values.taxRate}</p>
                <p>Total: ${values.total}</p>
              </div>
              <div className="terms">
                <h3>Terms</h3>
                <p>{values.terms}</p>
              </div>
              <div className="notes">
                <h3>Notes</h3>
                <p>{values.notes}</p>
              </div>
            </div>
          }
        </div>
      ) : (
        <div>
          {<h1>LOADING</h1>}
          Loading...
        </div>
      )}
    </div>
  );
};

export default ClientInvoice;
