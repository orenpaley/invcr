import React, { useEffect } from "react";
// import generatePdf from "./invoiceHelpers";
import "./Invoice.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { initialValues, initialItem } from "./initialValues";
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

const Invoice = () => {
  const [values, setValues] = useState(initialValues);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(e.target.name, e.target.value);
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleItemChange = (index, name, value) => {
    value.preventDefault();

    const items = values.items.map((item, i) => {
      if (i === index) {
        const newItem = { ...item };
        newItem[value.target.name] = value.target.value;
        return newItem;
      }
      return { ...item };
    });
    // current.items[index] = { [name]: value };
    // return current;
    console.log("updated items", items);
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
    const items = [...values.items, { ...initialItem }];

    setValues({ ...values, items });
  };

  useEffect(() => {
    let subtotal = 0;

    values.items.forEach((item) => {
      const quantNum = parseFloat(item.itemQuantity);
      const rateNum = parseFloat(item.itemRate);
      const amount = quantNum && rateNum ? quantNum * rateNum : 0;

      subtotal += amount;
    });

    setSubtotal(subtotal);
  }, [values.items]);

  useEffect(() => {
    let total = 0;

    total = subtotal * values.taxRate + subtotal;
    setTotal(total.toFixed(2));
  }, [subtotal, values.taxRate]);

  const generatePdf = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add the information for the person sending the invoice
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("John Doe", 20, 25);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("123 Main St", 20, 31);
    doc.text("Anytown, USA 12345", 20, 36);

    // Add the "Bill To" section
    doc.setFont(undefined, "bold");
    doc.text("Bill To:", 20, 55);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Jane Smith", 20, 60);
    doc.setFont(undefined, "normal");
    doc.text("456 Oak St", 20, 65);
    doc.text("Anytown, USA 12345", 20, 70);

    // Add Invoice Title / Info
    doc.setFontSize(28);
    doc.text("Invoice", 90, 15);
    // invoice #, date, due date
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Invoice Number:", 110, 55);
    doc.text("1234", 150, 55);

    doc.text("Date:", 110, 63);
    doc.setFont(undefined, "normal");
    doc.text("15 April 2023", 150, 63);

    doc.text("Due Date:", 110, 71);
    doc.setFont(undefined, "normal");
    doc.text("15 May 2023", 150, 71);

    autoTable(doc, {
      startY: 80,
      head: [["Description", "Quantity", "Price", "Total"]],
      body: [
        ["Item 1", "1", "$10.00", "$10.00"],
        ["Item 2", "2", "$20.00", "$40.00"],
        ["Item 3", "3", "$30.00", "$90.00"],
      ],
    });
    let finalY = doc.previousAutoTable.finalY;

    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 140, finalY + 10);
    doc.text("$140.00", 170, finalY + 10);

    doc.text("Tax:", 140, finalY + 20);
    doc.text("$14.00", 170, finalY + 20);

    doc.setFont(undefined, "bold");
    doc.text("Total:", 140, finalY + 30);
    doc.text("$154.00", 170, finalY + 30);

    doc.save("invoice.pdf");
  };
  return (
    <>
      <div>
        <div
          style={{
            width: "210mm",
          }}
        >
          <Button onClick={generatePdf}>Download</Button>{" "}
        </div>
      </div>
      <div
        style={{
          border: "1px solid black",
          width: "210mm",
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
                  <Label for="name" hidden>
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                  />
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
                    <Label for="invoiceCode">Invoice Number</Label>
                  </strong>
                  <Input
                    name="invoiceCode"
                    type="text"
                    placeholder="invoice code"
                    value={values.invoiceCode}
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
                    console.log("item where error is", item);
                    return (
                      <tr>
                        <td>
                          <Input
                            type="textarea"
                            placeholder="Item 1 + description"
                            name="itemName"
                            value={item.itemName}
                            onChange={(value) =>
                              handleItemChange(i, "itemName", value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            placeholder="quantity"
                            name="itemQuantity"
                            value={item.itemQuantity}
                            onChange={(value) =>
                              handleItemChange(i, "itemQuantity", value)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            placeholder="rate"
                            name="itemRate"
                            value={item.itemRate}
                            onChange={(value) =>
                              handleItemChange(i, "itemRate", value)
                            }
                          />
                        </td>
                        <td>
                          <div>
                            {getTotal(item.itemQuantity, item.itemRate)}
                          </div>
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
                      <span className="anything">
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
                  <Label for="date">Notes</Label>
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
                  <Label for="total">Total</Label>
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
