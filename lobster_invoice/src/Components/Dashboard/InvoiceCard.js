import React from "react";
import { addCommas } from "../../helpers/helpers";
import userContext from "../../userContext";
import { useContext, useState } from "react";
import { Button } from "reactstrap";

import LobsterApi from "../../API/api";

const InvoiceCard = ({
  invoiceData,
  onClick,
  active,
  handleDelete,
  handleStatusChange,
}) => {
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
  const { clientName, code, status, total, dueDate } = invoiceData;

  const handleClick = () => {
    if (onClick) {
      onClick(); // Invoke the onClick function passed as a prop
    }
  };

  const handleDeleteClick = () => {
    // Show a confirmation pop-up
    const userConfirmed = window.confirm("Are you sure you want to delete?");

    // Check if the user confirmed the deletion
    if (userConfirmed) {
      // The user confirmed, proceed with the API call to delete
      handleDelete(invoiceData.userId, invoiceData.id); // Pass the necessary information to the handleDelete function
    } else {
      return;
    }
  };

  return (
    <div
      className={`card mb-4 ${active === invoiceData ? "active" : ""}`}
      onClick={handleClick}
      style={{
        backgroundColor: "black",
        color: "white",
        border: "1px white solid",
        minWidth: "fit-content",
        width: "120px",
        fontSize: "9px",
      }}
    >
      <div className="card-body">
        <Button
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            color: "white",
            border: "1px solid red",
            margin: "auto",
            backgroundColor: "inherit",
            width: "24px",
            height: "24px",
            padding: "0px",
          }}
          onClick={handleDeleteClick}
        >
          X
        </Button>
        <h5 style={{ fontSize: "15px" }} className="card-title">
          {code}
        </h5>
        <div style={{ display: "flex", gap: "24px" }}>
          <p className="card-text">{clientName}</p>
          <select
            caret
            name={invoiceData.id}
            value={status}
            onChange={handleStatusChange}
            className={status + " card-text custom-select"}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="card-text">{addCommas(total)}</p>
        <p className="card-text">{dueDate}</p>
      </div>
    </div>
  );
};

export default InvoiceCard;
