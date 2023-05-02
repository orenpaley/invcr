import React, { useEffect } from "react";
// import generatePdf from "./invoiceHelpers";
import "./Invoice.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useContext } from "react";
import { initialValues, initialItem } from "./initialValues";
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
  FormText,
} from "reactstrap";

const Invoice = ({ data }) => {
  const [values, setValues] = useState(data || initialValues);
  console.log("values of the invoice opened => ", values);
  console.log("values total => ", values.total);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(null);
  const [user, setUser] = useContext(userContext);

  console.log("new total ", total);

  useEffect(() => {
    let itemsTotal = 0;
    values.items.forEach((item) => {
      const quantNum = parseFloat(item.quantity);
      const rateNum = parseFloat(item.rate);
      const amount = quantNum && rateNum ? quantNum * rateNum : 0;
      itemsTotal += amount;
      console.log("subtotal", subtotal);
    });
    setSubtotal(itemsTotal);
  }, [data, values]);

  useEffect(() => {
    let newTotal = subtotal * +values.taxRate + subtotal;
    setTotal(newTotal.toFixed(2));
    values.total = newTotal;
    console.log("total useeffect", total, subtotal, newTotal);
  }, [subtotal]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
      total: total,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("user id on save", user.id);
    const invoiceCheck = async () => {
      let isSaved = null;
      try {
        isSaved = await LobsterApi.getInvoice(user.id, values.code);
      } catch (e) {
        isSaved = null;
      }
      return isSaved;
    };
    const isInvoice = await invoiceCheck();
    console.log("is invoice======= ", isInvoice);
    const saveInvoice = async () => {
      if (isInvoice) {
        console.log("this is the invoice -> ", isInvoice);
        await LobsterApi.patchInvoice(user.id, values.code, values);
      } else {
        await LobsterApi.saveInvoice(user.id, values);
      }
    };
    saveInvoice();
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
    console.log("values on item change", values);
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
      item.splice(0, 3);
      console.log("what is in item?", item);
      let itemTotal = +item[1] * +item[2];
      item[3] = itemTotal;
    }
    console.log("items getting parsed to pdf", items);
    autoTable(doc, {
      startY: 80,
      head: [["Description", "Rate", "Quantity", "Total"]],
      body: items,
    });
    let finalY = doc.previousAutoTable.finalY;

    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 140, finalY + 10);
    doc.text(String(subtotal), 170, finalY + 10);

    doc.text("Tax:", 140, finalY + 20);
    doc.text(String(values.taxRate), 170, finalY + 20);

    doc.setFont(undefined, "bold");
    doc.text("Total:", 140, finalY + 30);
    doc.text(String(total), 170, finalY + 30);

    doc.text("Terms:", 20, finalY + 10);
    doc.text(String(values.terms), 20, finalY + 20);

    doc.text("Notes:", 20, finalY + 40);
    doc.text(String(values.notes), 20, finalY + 50);

    doc.save("invoice.pdf");
  };
  return (
    <>
      <div>
        <h2
          style={{
            maxWidth: "100mm",
            border: "3px solid black",
            margin: "15px auto",
            textAlign: "center",
            padding: "15px",
            fontSize: "44px",
            fontWeight: "700",
          }}
        >
          {values.code}
        </h2>
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
                <div className="group">
                  <Label for="firstName" hidden>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="first name"
                    type="text"
                    value={values.firstName}
                    onChange={handleChange}
                    style={{ display: "inline", width: "110px" }}
                  />
                  <span style={{ display: "inline !important" }}>
                    <Label for="lastName" hidden>
                      First Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="last name"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      style={{ display: "inline", width: "110px" }}
                    />
                  </span>
                </div>
                <div className="group">
                  <Label for="address" hidden>
                    Address
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="address line 1"
                    value={values.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <Label for="cityStateZip" hidden>
                    City, State, Zip
                  </Label>
                  <Input
                    id="cityStateZip"
                    name="cityStateZip"
                    placeholder="City,State,Zip"
                    type="text"
                    value={values.cityStateZip}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <Label for="email" hidden>
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
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
                  <Input
                    id="clientName"
                    name="clientName"
                    placeholder="Client Name"
                    type="text"
                    value={values.clientName}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <Label for="clientAddress" hidden>
                    Client Address
                  </Label>
                  <Input
                    type="text"
                    name="clientAddress"
                    placeholder="client address line 1"
                    value={values.clientAddress}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <Label for="clientCityStateZip" hidden>
                    Client City, State, Zip
                  </Label>
                  <Input
                    id="clientCityStateZip"
                    name="clientCityStateZip"
                    placeholder="Client City,State,Zip"
                    type="text"
                    value={values.clientCityStateZip}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <Label for="clientEmail" hidden>
                    Client Email
                  </Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    placeholder="Client Email"
                    type="email"
                    value={values.clientEmail}
                    onChange={handleChange}
                  />
                </div>
              </Form>
            </Col>
            <Col>
              <h4>Invoice Details</h4>
              <Form>
                <div className="group" id="formBasicInvoiceNumber">
                  <strong>
                    <Label for="code">
                      Invoice Code (must be uniqe to save)
                    </Label>
                  </strong>
                  <Input
                    name="code"
                    type="text"
                    placeholder="invoice code"
                    value={values.code}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <strong>
                    <Label for="date">Date</Label>
                  </strong>
                  <Input
                    id="date"
                    name="date"
                    placeholder="January 1, 2023"
                    type="date"
                    value={values.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="group">
                  <strong>
                    <Label for="due-date">Due Date</Label>
                  </strong>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    placeholder="February 1st, 2023"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                    required
                  />
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
                          <Input
                            type="textarea"
                            placeholder="Item 1 + description"
                            name="description"
                            value={item.description}
                            onChange={(value) =>
                              handleItemChange(i, "description", value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder="quantity"
                            name="quantity"
                            value={Number(item.quantity)}
                            onChange={(value) =>
                              handleItemChange(i, "quantity", value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder="rate"
                            name="rate"
                            value={Number(item.rate)}
                            onChange={(value) =>
                              handleItemChange(i, "rate", value)
                            }
                          />
                        </td>
                        <td>
                          <div>{getTotal(+item.quantity, +item.rate)}</div>
                        </td>
                        <Button
                          className="remove"
                          style={{ color: "black", border: "1px solid red" }}
                          onClick={() => {
                            handleRemove(i);
                          }}
                        >
                          X
                        </Button>
                      </tr>
                    );
                  })}
                  <div>
                    <p>
                      <span>
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
                      </span>
                      Add Line Item
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
                <Input
                  id="terms"
                  name="terms"
                  placeholder="type terms here ex : net 30"
                  type="textarea"
                  value={values.terms}
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <strong>
                  <Label for="notes">Notes</Label>
                </strong>
                <Input
                  id="notes"
                  className="textarea"
                  name="notes"
                  placeholder="Thank you!"
                  type="textarea"
                  value={values.notes}
                  onChange={handleChange}
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
                <Input
                  id="taxRate"
                  name="taxRate"
                  placeholder="Thank you!"
                  type="text"
                  value={values.taxRate}
                  onChange={handleChange}
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
