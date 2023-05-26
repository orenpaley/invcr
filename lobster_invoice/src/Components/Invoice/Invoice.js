import React, { useEffect } from "react";
// import generatePdf from "./invoiceHelpers";
import "./Invoice.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useContext } from "react";
import {
  initialValues,
  initialItem,
  initialValuesClear,
} from "./initialValues";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";

import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

import EditableField from "../../helpers/EditableField";

const Invoice = ({ data }) => {
  const [values, setValues] = useState(data || initialValues);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(null);
  const [user, setUser] = useContext(userContext);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      total: total,
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
        isSaved = await LobsterApi.getInvoice(user.id, values.code);
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
          await LobsterApi.patchInvoice(user.id, values.code, values);
        } catch (error) {
          setError("Failed to update invoice. Please try again."); // Set the error message
        }
      } else {
        try {
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
    console.log("items??? for download", items);
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
    doc.text(values.firstName + " " + values.lastName, 20, 25);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.address, 20, 31);
    doc.text(values.cityStateZip, 20, 36);

    // Add the "Bill To" section
    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 20, 55);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(values.clientName, 20, 60);
    doc.setFont(undefined, "normal");
    doc.text(values.clientAddress, 20, 65);
    doc.text(values.clientCityStateZip, 20, 70);

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
    for (let item of items) {
      item[3] = +item[1] * +item[2];
    }

    autoTable(doc, {
      startY: 80,
      head: [["Description", "Rate", "Quantity", "Total"]],
      body: [...items],
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
      <div>
        <EditableField
          id="code"
          name="code"
          placeholder="invoice code"
          className="titleInput"
          value={values.code}
          onChange={handleChange}
          type="text"
          editMode={editMode}
        >
          <h2>{values.code}</h2>
        </EditableField>
        {error && <div className="errorMsg warning">{error}</div>}

        {editMode ? (
          <h3 style={{ margin: "auto", textAlign: "center", color: "orange" }}>
            Edit Mode
          </h3>
        ) : (
          <h3 style={{ margin: "auto", textAlign: "center", color: "green" }}>
            View Mode
          </h3>
        )}
        <div
          style={{
            color: "white",
            backgrounColor: "blue",
            width: "280mm",
            margin: "auto",
            display: "flex",
            justifyContent: "flex-start",
            gap: "48px",
          }}
        >
          <Button className="btn btn-info downloadBtn" onClick={generatePdf}>
            Download
          </Button>
          <Button className="btn btn-warning saveBtn" onClick={handleSave}>
            Save
          </Button>
          <Button className="btn btn-secondary saveBtn" onClick={handleClear}>
            Clear
          </Button>
          <Button
            className="btn btn-success saveBtn"
            onClick={handleToggleEditMode}
          >
            View/Edit
          </Button>
        </div>
      </div>
      <div
        style={{
          border: "1px solid black",
          width: "280mm",
          height: "auto",
          margin: "auto",
          padding: "2px",
          fontSize: "12px",
          backgroundColor: "#FFE2E2",
        }}
      >
        <div className="form-row">
          {/* <div>
            <Label for="exampleFile">File</Label>
            <Input id="exampleFile" name="file" type="file" />
            <FormText>Insert Your Logo (optional)</FormText>
          </div> */}
          <div>
            <h1 className="heading">Invoice</h1>
          </div>
        </div>

        <Container className="container-box">
          <Row>
            <Col>
              <h4>Billing Details</h4>
              <Form>
                <div
                  style={{
                    padding: "12px",
                    border: "1px black dashed",
                    width: "80%",
                  }}
                  className="group"
                >
                  <Label for="firstName" hidden>
                    First Name
                  </Label>
                  <EditableField
                    id="firstName"
                    name="firstName"
                    placeholder="first name"
                    type="text"
                    value={values.firstName}
                    onChange={handleChange}
                    style={{ display: "inline", width: "110px" }}
                    editMode={editMode}
                  />
                  <span style={{ display: "inline !important" }}>
                    <Label for="lastName" hidden>
                      Last Name
                    </Label>
                    <EditableField
                      id="lastName"
                      name="lastName"
                      placeholder="last name"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      editMode={editMode}
                      style={{ display: "inline", width: "110px" }}
                    />
                  </span>

                  <div className="group">
                    <Label for="address" hidden>
                      Address
                    </Label>
                    <span>
                      <EditableField
                        type="text"
                        name="address"
                        placeholder="address line 1"
                        value={values.address}
                        onChange={handleChange}
                        editMode={editMode}
                      />
                    </span>
                  </div>

                  <div className="group">
                    <Label for="cityStateZip" hidden>
                      City, State, Zip
                    </Label>
                    <span>
                      <EditableField
                        id="cityStateZip"
                        name="cityStateZip"
                        placeholder="City,State,Zip"
                        type="text"
                        value={values.cityStateZip}
                        onChange={handleChange}
                        editMode={editMode}
                      />
                    </span>
                  </div>

                  <div className="group">
                    <Label for="email" hidden>
                      Email
                    </Label>
                    <EditableField
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                  <div>
                    <span>
                      <strong>Invoice To:</strong>
                    </span>
                  </div>
                  <div className="group">
                    <Label for="clientName" hidden>
                      Client Name
                    </Label>
                    <EditableField
                      id="clientName"
                      name="clientName"
                      placeholder="Client Name"
                      type="text"
                      value={values.clientName}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                  <div className="group">
                    <Label for="clientAddress" hidden>
                      Client Address
                    </Label>
                    <EditableField
                      type="text"
                      name="clientAddress"
                      placeholder="client address line 1"
                      value={values.clientAddress}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                  <div className="group">
                    <Label for="clientCityStateZip" hidden>
                      Client City, State, Zip
                    </Label>
                    <EditableField
                      id="clientCityStateZip"
                      name="clientCityStateZip"
                      placeholder="Client City,State,Zip"
                      type="text"
                      value={values.clientCityStateZip}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                  <div className="group">
                    <Label for="clientEmail" hidden>
                      Client Email
                    </Label>
                    <EditableField
                      id="clientEmail"
                      name="clientEmail"
                      placeholder="Client Email"
                      type="email"
                      value={values.clientEmail}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                </div>
              </Form>
            </Col>
            <Col>
              <h4>Invoice Details</h4>

              <Form>
                <div
                  style={{
                    padding: "12px",
                    border: "1px black dashed",
                    width: "80%",
                  }}
                  className="group"
                  id="formBasicInvoiceNumber"
                >
                  <div>
                    <strong>
                      <Label for="code">Invoice Code</Label>
                    </strong>
                    <EditableField
                      name="code"
                      type="text"
                      placeholder="invoice code"
                      value={values.code}
                      onChange={handleChange}
                      editMode={editMode}
                    />
                  </div>
                  <div className="group">
                    <strong>
                      <Label for="date">Date</Label>
                    </strong>
                    <EditableField
                      id="date"
                      name="date"
                      placeholder="January 1, 2023"
                      type="date"
                      value={values.date}
                      onChange={handleChange}
                      editMode={editMode}
                      required
                    />
                  </div>
                  <div className="group">
                    <strong>
                      <Label for="due-date">Due Date</Label>
                    </strong>
                    <EditableField
                      id="dueDate"
                      name="dueDate"
                      placeholder="February 1st, 2023"
                      type="date"
                      value={values.dueDate}
                      onChange={handleChange}
                      editMode={editMode}
                      required
                    />
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table className="itemTable">
                <thead>
                  <tr>
                    <th>Item/Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {values.items.map((item, i) => {
                    return (
                      <tr>
                        <td>
                          <EditableField
                            type="textarea"
                            placeholder="Item 1 + description"
                            name="description"
                            value={item.description}
                            onChange={(value) =>
                              handleItemChange(i, "description", value)
                            }
                            editMode={editMode}
                          />
                        </td>
                        <td>
                          <EditableField
                            type="number"
                            pattern="[0-9]"
                            placeholder="quantity"
                            name="quantity"
                            value={Number(item.quantity)}
                            onChange={(value) =>
                              handleItemChange(i, "quantity", value)
                            }
                            editMode={editMode}
                          />
                        </td>
                        <td>
                          <EditableField
                            type="number"
                            pattern="[0-9]"
                            placeholder="rate"
                            name="rate"
                            value={Number(item.rate)}
                            onChange={(value) =>
                              handleItemChange(i, "rate", value)
                            }
                            editMode={editMode}
                          />
                        </td>
                        <td>
                          <div>{getTotal(+item.quantity, +item.rate)}</div>
                        </td>
                        {editMode ? (
                          <Button
                            className="remove"
                            style={{ color: "black", border: "1px solid red" }}
                            onClick={() => {
                              handleRemove(i);
                            }}
                          >
                            X
                          </Button>
                        ) : (
                          <Button
                            disabled
                            hidden
                            className="remove"
                            style={{ color: "black", border: "1px solid red" }}
                            onClick={() => {
                              handleRemove(i);
                            }}
                          >
                            X
                          </Button>
                        )}
                      </tr>
                    );
                  })}
                  <div>
                    <p>
                      <span>
                        {editMode ? (
                          <Button
                            className="add"
                            style={{
                              fontSize: "22px",
                              backgroundColor: "lightgreen",
                              textAlign: "center",
                              margin: "8px",
                              padding: " 6px 16px",
                              margin: "8px",
                            }}
                            onClick={handleAdd}
                          >
                            +
                          </Button>
                        ) : (
                          <Button
                            disabled
                            hidden
                            className="add"
                            style={{
                              fontSize: "22px",
                              backgroundColor: "lightgreen",
                              textAlign: "center",
                              margin: "8px",
                              padding: " 6px 16px",
                              margin: "8px",
                            }}
                            onClick={handleAdd}
                          >
                            +
                          </Button>
                        )}
                      </span>
                      {editMode ? <p>Add Line Item</p> : <p></p>}
                    </p>
                  </div>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="group">
                <strong>
                  <Label for="terms">Terms</Label>
                </strong>
                <EditableField
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
                <EditableField
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
            <Col>
              <div className="group">
                <strong>
                  <Label for="subtotal">Subtotal</Label>
                </strong>
                <div>{subtotal}</div>
              </div>
              <div className="group">
                <strong>
                  <Label for="taxRate">Tax Rate</Label>
                </strong>
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
                <div>{total}</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Invoice;
