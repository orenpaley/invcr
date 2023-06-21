import React, { useState, useEffect, useContext } from "react";
import { Table, Button, NavLink } from "reactstrap";
import Chart from "./Chart";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { Navigate, useNavigate } from "react-router-dom";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [paid, setPaid] = useState(0);
  const [owed, setOwed] = useState(0);
  const [statuses, setStatuses] = useState({});
  const [context, setContext] = useContext(userContext);

  const [chartData, setChartData] = useState(null);

  const [refreshChart, setRefreshChart] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [context, paid, owed, statuses]);

  const fetchInvoices = async () => {
    try {
      if (!LobsterApi.token) LobsterApi.token = context.token;
      const fetchedInvoices = await LobsterApi.getInvoices(context.user.id);
      let sorted = [...fetchedInvoices].sort((a, b) =>
        a.code.localeCompare(b.code, "en", { numeric: true })
      );
      setInvoices(sorted);
    } catch (error) {}
  };

  useEffect(() => {
    const calculateTotals = () => {
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
    if (context.user) {
      fetchChartData();
      handleRefreshChart();
    }
  }, [paid, owed, statuses]);

  if (!context.user) {
    return <Navigate to="/error-page" replace />;
  }

  const handleRefreshChart = () => {
    // Toggle the refreshChart state variable to trigger re-render

    setRefreshChart((prevState) => !prevState);
  };

  const handleOpenInvoice = async (e) => {
    e.preventDefault();
    const invoiceCode = e.target.dataset.id;
    try {
      const data = await LobsterApi.getInvoice(context.user.id, invoiceCode);
      navigate("/", { state: { ...data, items: data.items } });
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
      await LobsterApi.patchInvoice(context.user.id, name, { status: value });

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
    const invoiceId = e.target.value;
    try {
      await LobsterApi.deleteInvoice(context.user.id, invoiceId);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <>
      <Table hover style={{ maxWidth: "800px", margin: "auto" }}>
        <thead>
          <tr>
            <th>Invoice Code</th>
            <th>Client Name</th>
            <th>status</th>
            <th>Date</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <th>
                <p
                  name="id"
                  value={invoice.id}
                  data-id={invoice.id}
                  onClick={handleOpenInvoice}
                  scope="row"
                  style={{
                    cursor: "pointer",
                    borderBottom: "3px solid aquamarine",
                    width: "60px",
                  }}
                >
                  {invoice.code}
                </p>
              </th>
              <td>{invoice.clientName}</td>
              <td>
                <select
                  caret
                  name={invoice.id}
                  value={invoice.status}
                  onChange={handleClick}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>{invoice.dueDate.slice(0, 10)}</td>
              <td>{invoice.total}</td>
              <td>
                <Button
                  color="danger"
                  onClick={handleDelete}
                  value={invoice.id}
                >
                  X
                </Button>
              </td>
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
