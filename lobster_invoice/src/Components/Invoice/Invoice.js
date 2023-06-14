import React, { useEffect } from "react";
// import generatePdf from "./invoiceHelpers";

import SendMail from "./SendMail";
import "./Invoice.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ItemTable from "./ItemTable";
import InvoiceDetails from "./InvoiceDetails";
import BillingDetails from "./BillingDetails";
import ClientDetails from "./ClientDetails";
import { useState, useContext } from "react";
import {
  initialValues,
  initialItem,
  initialValuesClear,
} from "./initialValues";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";

import { Container, Row, Col, Table, Form, Label, Button } from "reactstrap";

import EditableField, { EditableTextArea } from "../../helpers/EditableField";

import { BiDownload } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import {
  RiDeleteBin3Fill,
  RiEditBoxLine,
  RiEditBoxFill,
  RiMailSendLine,
} from "react-icons/ri";

const Invoice = ({ data, clients = null }) => {
  console.log("invoice data", data);
  const [values, setValues] = useState(data || initialValues);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(null);
  const [user, setUser] = useContext(userContext);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState({
    to: "",
    from: "noreply@invcr.io",
    subject: "INVCR Invoice Incoming",
    html: `Click the link below to view the PDF preview:<br/><a href="http://localhost:3000/client-invoice/${user.id}/${values.id}">download</a>`,
  });

  useEffect(() => {
    let itemsTotal = 0;
    values.items.forEach((item) => {
      const quantNum = parseFloat(item.quantity);
      const rateNum = parseFloat(item.rate);
      const amount = quantNum && rateNum ? quantNum * rateNum : 0;
      itemsTotal += amount;
    });
    setSubtotal(itemsTotal);
  }, [data, values, total]);

  useEffect(() => {
    let newTotal = subtotal * +values.taxRate + subtotal;
    setTotal(newTotal.toFixed(2));
    values.total = newTotal;
  }, [subtotal, values.taxRate]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpen = async (e) => {
    e.preventDefault();
    handleSave(e);
    setShowModal(true);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      total: total,
    });
  };

  const handleClientChange = (e) => {
    e.preventDefault();

    const client = clients.find((c) => c.id === e.target.value);

    setValues({
      ...values,
      clientName: client.name,
      clientAddress: client.address,
      clientEmail: client.email,
    });
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const invoiceCheck = async () => {
      let isSaved = null;
      try {
        isSaved = await LobsterApi.getInvoice(user.id, values.id);
      } catch (e) {
        isSaved = null;
      } finally {
        return isSaved;
      }
    };
    const isInvoice = await invoiceCheck();

    const saveInvoice = async () => {
      if (isInvoice) {
        try {
          await LobsterApi.patchInvoice(user.id, values.id, values);
        } catch (error) {
          setError("Failed to update invoice. Please try again."); // Set the error message
        }
      } else {
        try {
          console.log("invoice values on save!!!!!!!", values);
          await LobsterApi.saveInvoice(user.id, values);
        } catch (error) {
          setError("Log in to save.");
        }
      }
    };
    saveInvoice();
  };

  const handleClear = (e) => {
    e.preventDefault();
    setValues(initialValuesClear);
  };

  const handleItemChange = (index, name, value) => {
    value.preventDefault();

    const items = values.items.map((item, i) => {
      if (i === index) {
        const newItem = { ...item };
        setSubtotal(subtotal + newItem.rate * newItem.quantity);
        values.subtotal = subtotal;
        newItem[value.target.name] = value.target.value;
        return newItem;
      }
      return { ...item };
    });
    // current.items[index] = { [name]: value };
    // return current;
    setValues({ ...values, items });
  };

  const getTotal = (quantity, rate) => {
    const quantNum = parseInt(quantity);
    const rateNum = parseInt(rate);
    let total = quantNum && rateNum ? quantNum * rateNum : 0;
    return total;
  };

  const handleRemove = (i) => {
    const items = values.items.filter((item, index) => index !== i);
    setValues({ ...values, items });
  };

  const handleAdd = () => {
    const items = [
      ...values.items,
      {
        ...initialItem,
        index: values.items.length + 1,
        userId: values.userId,
        invoiceId: values.id,
      },
    ];

    setValues({ ...values, items });
  };

  const getItems = () => {
    let items = values.items;
    let itemArr = [];

    items.forEach((item) => {
      let vals = Object.values(item);
      itemArr.push([vals.map((v) => String(v))]);
    });
    return itemArr.flat();
  };

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
      item[6] = +item[4] * +item[5];
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
  };

  return (
    <>
      <div className="error-msg">
        {error && <div className="errorMsg warning">{error}</div>}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "auto",
        }}
      >
        <div className="invoice-form">
          {/* <div className="form-row"> */}
          {/* <div>
            <Label for="exampleFile">File</Label>
            <Input id="exampleFile" name="file" type="file" />
            <FormText>Insert Your Logo (optional)</FormText>
          </div> */}
          {/* </div> */}

          <Container className="container-box">
            <Row>
              <Col sm="8">
                <InvoiceDetails
                  values={values}
                  editMode={editMode}
                  handleChange={handleChange}
                  user={user}
                  className="invoice-field-box"
                />
              </Col>
              <Col sm="4">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <BillingDetails
                    user={user}
                    values={values}
                    editMode={editMode}
                    handleChange={handleChange}
                    className="invoice-field-box"
                  />
                  <ClientDetails
                    values={values}
                    handleClientChange={handleClientChange}
                    clients={clients}
                    editMode={editMode}
                    handleChange={handleChange}
                    user={user}
                    className="invoice-field-box"
                  />
                </div>
              </Col>
            </Row>

            <Row className="row justify-content-center">
              <div style={{ margin: "auto", marginTop: "24px" }}>
                {values.items.length > 0 ? (
                  <ItemTable
                    values={values}
                    editMode={editMode}
                    handleItemChange={handleItemChange}
                    handleAdd={handleAdd}
                    handleRemove={handleRemove}
                    getTotal={getTotal}
                  />
                ) : (
                  <div className="row justify-content-center">
                    <Button
                      className="add"
                      style={{
                        fontSize: "22px",
                        backgroundColor: "#198754",
                        textAlign: "center",
                        margin: "8px",
                        padding: "6px 16px",
                        margin: "8px",
                        minWidth: "300px",
                      }}
                      onClick={handleAdd}
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            </Row>
            <Row>
              <Col sm="8">
                <div className="group">
                  <strong>
                    <Label for="terms">Terms</Label>
                    <br></br>
                  </strong>
                  <EditableTextArea
                    id="terms"
                    name="terms"
                    placeholder="type terms here ex : net 30"
                    type="textarea"
                    value={values.terms}
                    onChange={handleChange}
                    editMode={editMode}
                  />
                </div>
                <div className="group">
                  <strong>
                    <Label for="notes">Notes</Label>
                  </strong>
                  <br></br>
                  <EditableTextArea
                    id="notes"
                    className="textarea"
                    name="notes"
                    placeholder="Thank you!"
                    type="textarea"
                    value={values.notes}
                    onChange={handleChange}
                    editMode={editMode}
                  />
                </div>
              </Col>
              <Col sm="4" style={{ textAlign: "right" }}>
                <div className="group">
                  <strong>
                    <Label for="subtotal">Subtotal</Label>
                  </strong>
                  <div className="subtotal">{subtotal}</div>
                </div>
                <div className="group">
                  <strong>
                    <Label for="taxRate">Tax Rate</Label>
                  </strong>
                  <br></br>
                  <EditableField
                    id="taxRate"
                    name="taxRate"
                    placeholder="Thank you!"
                    type="text"
                    value={values.taxRate}
                    onChange={handleChange}
                    editMode={editMode}
                  />
                </div>
                <div className="group">
                  <strong>
                    <Label for="total" value={values.total}>
                      Total
                    </Label>
                  </strong>
                  <div className="total">{total}</div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginLeft: "36px",
          }}
        >
          <BiDownload onClick={generatePdf} style={{ fontSize: "24px" }} />
          {/* <Button className="btn btn-info downloadBtn" >
            Download
          </Button> */}
          <FaSave onClick={handleSave} style={{ fontSize: "24px" }} />
          {/* <Button className="btn btn-warning saveBtn" onClick={handleSave}>
            Save
          </Button> */}
          {/* <Button className="btn btn-secondary saveBtn" onClick={handleClear}>
            Clear
          </Button> */}

          <RiDeleteBin3Fill
            onClick={handleClear}
            style={{ fontSize: "24px" }}
          />
          {editMode ? (
            <RiEditBoxFill
              onClick={handleToggleEditMode}
              style={{ fontSize: "24px" }}
            />
          ) : (
            <RiEditBoxLine
              onClick={handleToggleEditMode}
              style={{ fontSize: "24px" }}
            />
          )}
          {/* <Button
            className="btn btn-success saveBtn"
            onClick={handleToggleEditMode}
          >
            View/Edit
          </Button> */}
          {user.id ? (
            <>
              {/* <button className="btn btn-primary" onClick={handleOpen}>
                Send
              </button> */}
              <RiMailSendLine
                onClick={handleOpen}
                style={{ fontSize: "24px" }}
              />
              <SendMail
                showModal={showModal}
                handleClose={handleClose}
                id={user.id}
                msg={msg}
                invoiceId={values.id}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Invoice;
