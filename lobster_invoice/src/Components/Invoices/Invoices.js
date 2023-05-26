import React, { useState, useEffect, useContext } from "react";
import { Table, Button } from "reactstrap";
import Chart from "./Chart";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [paid, setPaid] = useState(0);
  const [owed, setOwed] = useState(0);
  const [statuses, setStatuses] = useState({});
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("curr")));

  const [chartData, setChartData] = useState(null);

  const [refreshChart, setRefreshChart] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const fetchedInvoices = await LobsterApi.getInvoices(user.id);
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [user, paid, owed, statuses]);

  useEffect(() => {
    const calculateTotals = () => {
      console.log("effect -> CALCULATING TOTALS");
      let invPaid = 0;
      let invOwed = 0;
      for (let inv of invoices) {
        if (inv.status === "paid") {
          invPaid += +inv.total;
        }
        if (inv.status === "sent" || inv.status === "overdue") {
          invOwed += +inv.total;
        }
      }
      setPaid(invPaid);
      setOwed(invOwed);
    };
    calculateTotals();
  }, [invoices, statuses]);

  useEffect(() => {
    const chartData = {
      labels: ["Paid/Owed"],
      datasets: [
        {
          label: "paid",
          data: [paid],
          backgroundColor: ["#36A2EB"],
        },
        {
          label: "owed",
          data: [owed],
          backgroundColor: ["#FF6384"],
        },
      ],
    };
    setChartData(chartData);
  }, [paid, owed, statuses]);

  useEffect(() => {
    const fetchChartData = () => {
      const chartData = {
        labels: ["Paid/Owed"],
        datasets: [
          {
            label: "paid",
            data: [paid],
            backgroundColor: ["#36A2EB"],
          },
          {
            label: "owed",
            data: [owed],
            backgroundColor: ["#FF6384"],
          },
        ],
      };
      setChartData(chartData);
    };

    fetchChartData();
    handleRefreshChart();
  }, [paid, owed, statuses]);

  const handleRefreshChart = () => {
    // Toggle the refreshChart state variable to trigger re-render

    setRefreshChart((prevState) => !prevState);
  };

  const handleOpenInvoice = async (e) => {
    e.preventDefault();
    const invoiceCode = e.target.dataset.code;
    try {
      const data = await LobsterApi.getInvoice(user.id, invoiceCode);
      navigate("/", { state: data });
    } catch (error) {
      console.error("Error opening invoice:", error);
    }
  };

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

  const handleClick = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    try {
      await LobsterApi.patchInvoice(user.id, name, { status: value });
      console.log(`Status updated for ${name}: ${value}`);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [name]: value,
      }));
      handleRefreshChart(); // Refresh the chart component
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const invoiceCode = e.target.value;
    try {
      await LobsterApi.deleteInvoice(user.id, invoiceCode);
      console.log("Deleted invoice:", invoiceCode);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <>
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
              <Button
                color="danger"
                onClick={handleDelete}
                value={invoice.code}
              >
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

      <div>
        <Button color="warning" onClick={handleRefreshChart}>
          Refresh Chart
        </Button>
        <Chart data={chartData} key={refreshChart} />
        <div
          style={{
            display: "flex",
            gap: "70px",
            margin: "auto",
            justifyContent: "center",
            textAlign: "center",
          }}
        ></div>
      </div>
    </>
  );
};

export default Invoices;
