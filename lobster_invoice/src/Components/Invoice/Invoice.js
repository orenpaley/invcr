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
import Logo from "../Logo";
import { useState, useContext } from "react";
import { initialItem, initialValuesClear } from "./initialValues";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";

import {
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Form,
  Label,
  Button,
  Input,
} from "reactstrap";

import EditableField, { EditableTextArea } from "../../helpers/EditableField";

import { BiDownload } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import {
  RiAddLine,
  RiEditBoxLine,
  RiEditBoxFill,
  RiMailSendLine,
} from "react-icons/ri";

const Invoice = ({ data, clients = null }) => {
  const [values, setValues] = useState(data || initialValuesClear);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(null);
  const [context, setContext] = useContext(userContext);
  const [user, setUser] = useState(context.user || {});
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState({
    to: "",
    from: "noreply@invcr.io",
    subject: "INVCR Invoice Incoming",
    html: `Click the link below to view the PDF preview:<br/><a href="http://data.invcr.io/client-invoice/${user.id}/${values.id}">download</a>`,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (context) {
      if (!LobsterApi.token) {
        LobsterApi.token = context.token;
      }
    }
  }, []);

  useEffect(() => {
    let itemsTotal = 0;
    values.items.forEach((item) => {
      const quantNum = parseFloat(item.quantity);
      const rateNum = parseFloat(item.rate);
      const amount = quantNum && rateNum ? quantNum * rateNum : 0;
      itemsTotal += amount;
    });
    setSubtotal(itemsTotal);
  }, [values]);

  useEffect(() => {
    let newTotal = subtotal * Math.min(+values.taxRate, 1) + subtotal;
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

  const handleGetBillingDetails = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      name: user.name,
      email: user.email,
      address: user.address,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const invoiceCheck = async () => {
      const userInvoices = await LobsterApi.getInvoices(user.id);

      for (let invoice of userInvoices) {
        if (invoice.id == values.id && invoice.code == values.code) return true;
      }
      return false;
    };

    if (!user.id) {
      setError("log in to save");
    } else {
      let isInvoice = await invoiceCheck();

      const saveInvoice = async () => {
        if (values.date > values.dueDate) {
          setError("due date must be later than date");
        } else {
          if (isInvoice) {
            try {
              await LobsterApi.patchInvoice(user.id, values.id, values);
            } catch (error) {
              setError("Failed to update invoice. Please try again.");
              // Set the error message
            }
          }
          if (!isInvoice) {
            try {
              const saved = await LobsterApi.saveInvoice(user.id, values);
              if (!values) setValues(saved);
            } catch (error) {
              setError("something went wrong");
            }
          }
        }
      };
      await saveInvoice();
    }
  };

  const handleNew = (e) => {
    e.preventDefault();
    if (user.id) handleSave(e);

    setValues({ ...initialValuesClear, id: null });
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
        userId: user.id,
        invoiceId: values.id,
      },
    ];

    setValues({ ...values, items });
  };

  const getItems = () => {
    let items = values.items;
    let itemArr = [];

    items.forEach((item) => {
      let newItem = [];
      newItem[0] = item.description;
      newItem[1] = item.rate;
      newItem[2] = item.quantity;
      newItem[3] = +newItem[1] * +newItem[2];
      itemArr.push(newItem);
    });
    return itemArr;
  };

  const generatePdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add Invoice Title / Info
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Invoice", 90, 8);

    // Filled background for title
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.setFillColor("#5e954b");
    doc.rect(0, 0, 500, 12, "F");
    doc.restoreGraphicsState();

    let topY = 35;
    let rightY = 35;
    let topX = 110;

    // Logo
    doc.addImage(imagePreview, "png", 5, 20, 25, 15);

    // Add user / From
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.name, 20, 10 + topY);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    {
      values.address ? doc.text(values.address, 20, 16 + topY) : (topY -= 10);
    }
    doc.text(values.email, 20, 26 + topY);

    // Add the "Bill To" section
    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 20, 38 + topY);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.clientName, 20, 44 + topY);
    doc.setFont(undefined, "normal");
    {
      values.clientAddress
        ? doc.text(values.clientAddress, 20, 50 + topY)
        : (topY -= 12);
    }

    doc.text(values.clientEmail, 20, 60 + topY);

    // invoice #, date, due date
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Invoice Number:", topX + 15, 10 + rightY);
    doc.text(values.code, topX + 50, 10 + rightY);

    doc.text("Date:", topX + 15, 18 + rightY);
    doc.setFont(undefined, "normal");
    doc.text(values.date, topX + 50, 18 + rightY);

    doc.text("Due Date:", topX + 15, 26 + rightY);
    doc.setFont(undefined, "normal");
    doc.text(values.dueDate, topX + 50, 26 + rightY);

    const items = getItems();

    autoTable(doc, {
      startY: 80 + topY,
      head: [["Description", "Rate", "Quantity", "Total"]],
      body: [...items],
    });
    let finalY = doc.previousAutoTable.finalY;

    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 140, finalY + 10);
    doc.text("$" + String(subtotal), 170, finalY + 10);

    doc.text("Tax:", 140, finalY + 20);
    doc.text(String(values.taxRate * 100) + "%", 170, finalY + 20);

    doc.setFont(undefined, "bold");
    doc.text("Total:", 140, finalY + 30);
    doc.text("$" + String(values.total), 170, finalY + 30);

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
          <Container className="container-box">
            <Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <Logo
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  editMode={editMode}
                />

                <div
                  style={{
                    fontSize: "36px",
                    alignSelf: "baseline",
                    justifySelf: "baseline",
                  }}
                >
                  Invoice
                </div>
              </div>
            </Row>
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
                  {context.user ? (
                    <span>
                      <Button
                        className="generateBillingButton"
                        onClick={handleGetBillingDetails}
                      >
                        Generate Billing Details
                      </Button>
                    </span>
                  ) : (
                    <span></span>
                  )}

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
                ) : editMode ? (
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
                ) : (
                  <div></div>
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
                    type="number"
                    value={
                      values.taxRate > 1
                        ? 1
                        : values.taxRate < 0
                        ? 0
                        : values.taxRate
                    }
                    step={0.01}
                    min={0}
                    max={1}
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
          <RiAddLine onClick={handleNew} style={{ fontSize: "24px" }} />
          <BiDownload onClick={generatePdf} style={{ fontSize: "24px" }} />
          {/* <Button className="btn btn-info downloadBtn" >
            Download
          </Button> */}
          <FaSave
            onClick={user ? handleSave : setError("log in to save")}
            style={{ fontSize: "24px" }}
          />
          {/* <Button className="btn btn-warning saveBtn" onClick={handleSave}>
            Save
          </Button> */}
          {/* <Button className="btn btn-secondary saveBtn" onClick={handleClear}>
            Clear
          </Button> */}

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
                clientEmail={values.clientEmail}
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
