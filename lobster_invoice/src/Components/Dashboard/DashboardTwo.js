import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import LobsterApi from "../../API/api";
import userContext from "../../userContext";
import { Table, Button, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import InvoiceCard from "./InvoiceCard";
import DoughnutChart from "./Doughnut";
import { throttle, SquareScroll } from "../../helpers/helpers";
import { initialValuesClear } from "../Invoice/initialValues";

const DashboardTwo = () => {
  const navigate = useNavigate();
  const [context, setContext] = useContext(userContext);
  const [user, setUser] = useState(context.user || {});
  const [invoices, setInvoices] = useState([]);
  const [sortedInvoices, setSortedInvoices] = useState([]);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [statusToAmount, setStatusToAmount] = useState({
    paid: 0,
    sent: 0,
    created: 0,
    overdue: 0,
  });
  const [selectedOption, setSelectedOption] = useState("code");
  const [codeSortOrder, setCodeSortOrder] = useState("asc");
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  // Other sort orders here (dateSortOrder, dueDateSortOrder, clientSortOrder)

  const fetchInvoices = async () => {
    try {
      const fetched = await LobsterApi.getInvoices(user.id);
      setInvoices(fetched);

      // Sort the invoices based on the selected option and sort order
      const sorted = sortInvoices(selectedOption, codeSortOrder, fetched);
      setSortedInvoices(sorted);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDelete = async (userId, invoiceId) => {
    try {
      await LobsterApi.deleteInvoice(userId, invoiceId);
      // Fetch the updated list of invoices after deletion
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const sortInvoices = (option, sortOrder) => {
    return [...sortedInvoices].sort((a, b) => {
      switch (option) {
        case "code":
          return sortOrder === "asc"
            ? a.code.localeCompare(b.code)
            : b.code.localeCompare(a.code);

        case "due-date":
          return sortOrder === "asc"
            ? a.dueDate.localeCompare(b.dueDate)
            : b.code.localeCompare(a.dueDate);

        case "client":
          return sortOrder === "asc"
            ? a.client.localeCompare(b.client)
            : b.client.localeCompare(a.client);

        // Add other cases for different sort options here (date, due-date, client)

        default:
          return [...sortedInvoices];
      }
    });
  };

  const handleSort = () => {
    const newSortOrder = codeSortOrder === "asc" ? "desc" : "asc";
    setCodeSortOrder(newSortOrder);

    // Sort the invoices based on the new sorting option and order
    const sorted = sortInvoices(selectedOption, newSortOrder);

    // Update the sortedInvoices state with the sorted array
    setSortedInvoices(sorted);
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    try {
      await LobsterApi.patchInvoice(user.id, name, {
        status: value,
      });

      // Increment the statusChangeCount each time the invoice status changes
      setStatusChangeCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  useEffect(() => {
    async function getInvoices() {
      if (context) {
        let fetched = await LobsterApi.getInvoices(user.id);
        return fetched;
      } else {
        console.log("NO INVOICES FOUND, YET");
        return [];
      }
    }

    async function fetchInvoices() {
      console.log("fetching");
      let fetched = await getInvoices();
      setInvoices(fetched);

      // Initially set the sortedInvoices to the sorted invoices based on the selected sorting option and order
      setSortedInvoices(fetched);
    }

    // Only fetch invoices if the context is available
    if (context) {
      fetchInvoices();
    }

    // If the status changes, fetch the invoices again
    // This will cause the component to rerender with the updated invoices
    // Note: You may need to adjust this dependency based on how the status changes in your application
  }, [user, statusChangeCount]); // Add statusToAmount as a dependency

  useEffect(() => {
    // Calculate the new statusToAmount based on the invoices array
    const newStatusToAmount = {
      paid: 0,
      sent: 0,
      created: 0,
      overdue: 0,
    };

    for (let invoice of invoices) {
      newStatusToAmount[invoice.status.toLowerCase()] += Number(invoice.total);
    }

    // Update the statusToAmount state with the new values
    setStatusToAmount(newStatusToAmount);
  }, [sortedInvoices]);

  useEffect(() => {
    // Calculate the new sortedInvoices based on the selected sorting option and order
    const newSortedInvoices = sortInvoices(selectedOption, codeSortOrder);

    // Update the sortedInvoices state with the new sorted array
    setSortedInvoices(newSortedInvoices);
  }, [selectedOption, codeSortOrder]);

  const handleInvoiceClick = (invoice) => {
    setActiveInvoice(invoice);
  };
  const [leftDivWidth, setLeftDivWidth] = useState("50%");
  const [isDragging, setIsDragging] = useState(false);

  const DRAG_THROTTLE_TIME = 16; // 60fps, change as needed

  const handleSliderMouseDown = () => {
    setIsDragging(true);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
  };

  const handleSliderMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const containerWidth = sliderRef.current.parentNode.offsetWidth;
      const sliderPosition =
        e.clientX - sliderRef.current.parentNode.getBoundingClientRect().left;
      const newLeftDivWidth = Math.max(
        0,
        Math.min(100, (sliderPosition / containerWidth) * 100)
      ); // Constrain resizing between 0% and 100%
      setLeftDivWidth(`${newLeftDivWidth}%`);
    },
    [isDragging]
  );

  // Throttle the mousemove event handler to limit the frequency of calls
  const throttledHandleSliderMove = useCallback(
    throttle(handleSliderMove, DRAG_THROTTLE_TIME),
    [handleSliderMove]
  );

  const sliderRef = useRef(null);

  useEffect(() => {
    // Attach event listeners to the slider element for better dragging experience
    sliderRef.current.addEventListener("mousedown", handleSliderMouseDown);
    document.addEventListener("mouseup", handleSliderMouseUp);
    document.addEventListener("mouseleave", handleSliderMouseUp);
    document.addEventListener("mousemove", throttledHandleSliderMove);

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener("mouseup", handleSliderMouseUp);
      document.removeEventListener("mouseleave", handleSliderMouseUp);
      document.removeEventListener("mousemove", throttledHandleSliderMove);
    };
  }, [throttledHandleSliderMove]);

  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -100, // Adjust this value to control the amount of scroll
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 100, // Adjust this value to control the amount of scroll
      behavior: "smooth",
    });
  };

  const invoiceCards = sortedInvoices.map((invoice) => (
    <InvoiceCard
      onClick={() => handleInvoiceClick(invoice)}
      key={invoice.id}
      invoiceData={invoice}
      active={activeInvoice}
      name={invoice.id}
      handleDelete={handleDelete}
      value={invoice.userId}
      handleStatusChange={handleStatusChange}
    />
  ));

  return (
    <div
      className="mac-down-container"
      style={{
        display: "block",
        height: "650px",
        width: "90%",
        border: "2px grey solid",
        margin: "auto",
        position: "relative", // Add position: relative to the container to allow absolute positioning of the slider
      }}
    >
      <div
        className="dark-mode"
        style={{
          width: leftDivWidth,
          backgroundColor: "black",
          height: "100%",
        }}
      >
        {
          <div className="dark-container">
            <div className="flex-top-row-dark">
              <div>
                <h3
                  style={{
                    color: "white",
                    margin: "auto",
                    textAlign: "start",
                    padding: "16px",
                    fontSize: "13px",
                  }}
                >
                  You have saved{" "}
                  <span style={{ color: "lightgreen" }}>
                    {invoices.length}{" "}
                  </span>
                  invoices.
                </h3>
              </div>
              <div>
                <Button
                  color="success"
                  style={{
                    width: "200px",
                    height: "auto",
                    margin: "auto",
                    marginRight: "6px",
                    marginLeft: "auto",
                  }}
                  onClick={() => navigate("/")}
                >
                  Create
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginLeft: "auto",
                }}
              >
                <FormGroup style={{ alignSelf: "center", margin: "auto" }}>
                  <Label hidden for="sort-invoices">
                    Sort
                  </Label>
                  <Input
                    type="select"
                    name="sort-invoices"
                    id="sort-select-invoices"
                    onChange={handleSelectChange} // Call the handleSelectChange function on select change
                    value={selectedOption}
                  >
                    <option value="code">code&#8593;&#8595; </option>
                    {/* <option value="date">date&#8593;&#8595; </option> */}
                    <option value="due-date">due date&#8593;&#8595; </option>
                    <option value="client">client&#8593;&#8595; </option>
                  </Input>
                </FormGroup>

                <div>
                  <Button onClick={handleSort}>Sort</Button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                overflow: "hidden",
                textAlign: "center",
                justifyContent: "center",
                gap: "24px",
              }}
            >
              <SquareScroll
                cards={invoiceCards}
                containerRef={containerRef}
                scrollLeft={scrollLeft}
                scrollRight={scrollRight}
                activeInvoice={activeInvoice}
              />
            </div>
            <div style={{ margin: "auto" }}>
              <DoughnutChart
                invoices={invoices}
                statusToAmount={statusToAmount}
              />
            </div>
          </div>
        }
      </div>
      <div
        className="slider"
        ref={sliderRef}
        style={{
          display: "block",
          backgroundColor: "red",
          color: "red",
          width: "5px", // Width of the vertical strip
          cursor: "col-resize",
          position: "absolute", // Add position: absolute to position the slider precisely
          zIndex: 1, // Add zIndex to bring the slider to the front
          top: 0,
          bottom: 0,
          left: leftDivWidth, // Poasition the vertical strip according to the left div's width
          margin: "auto",
        }}
      ></div>
      <div
        className="light-mode"
        style={{
          width: `calc(100% - ${leftDivWidth})`,
          backgroundColor: "aliceblue",
          height: "100%",
          position: "absolute",
          top: 0,
          left: leftDivWidth,
          right: 0,
        }}
      >
        <div className="invoice-details-container">
          <div className="invoice-details">
            {activeInvoice ? (
              <div>
                {
                  <div className="client-invoice">
                    <div className="topcontainer">
                      <div className="subcontainer header">
                        <div className="dashboard_top_row">
                          {activeInvoice.status === "paid" ? (
                            <div className="dash_status bg-paid">
                              {activeInvoice.status}
                            </div>
                          ) : activeInvoice.status === "sent" ? (
                            <div className="dash_status bg-sent">
                              {activeInvoice.status}
                            </div>
                          ) : activeInvoice.status === "created" ? (
                            <div className="dash_status bg-created">
                              {activeInvoice.status}
                            </div>
                          ) : activeInvoice.status === "overdue" ? (
                            <div className="dash_status bg-overdue">
                              {activeInvoice.status}
                            </div>
                          ) : (
                            {}
                          )}
                          <Button
                            className="dash-open-btn"
                            onClick={() => {
                              navigate("/", {
                                state: {
                                  ...initialValuesClear,
                                  ...activeInvoice,
                                },
                              });
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                      <div className="flex-container-info-row">
                        <div className="subcontainer general-info">
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
                    </div>
                    <div className="items" style={{ maxWidth: "fit-content" }}>
                      <h3 style={{ margin: "auto", textAlign: "center" }}>
                        Items
                      </h3>
                      <Table
                        style={{
                          width: "500px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th w-25>Description</th>
                            <th w-25>Rate</th>
                            <th w-25>Quantity</th>
                            <th w-25>Total</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: "11px" }}>
                          {activeInvoice.items ? (
                            activeInvoice.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.description}</td>
                                <td>${item.rate}</td>
                                <td>{item.quantity}</td>
                                <td>${item.rate * item.quantity}</td>
                              </tr>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    <div className="footer">
                      <p>
                        Subtotal: $
                        {activeInvoice.items
                          ? activeInvoice.items
                              .reduce((a, item) => {
                                return (a += item.rate * item.quantity);
                              }, 0)
                              .toFixed(2)
                          : 0}
                      </p>
                      <p>Tax : {(activeInvoice.taxRate * 100).toFixed(2)}%</p>
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
    </div>
  );
};

export default DashboardTwo;
