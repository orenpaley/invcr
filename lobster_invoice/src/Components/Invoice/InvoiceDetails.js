import { Form, Label, Table } from "reactstrap";
import EditableField from "../../helpers/EditableField";

const InvoiceDetails = ({ values, handleChange, editMode }) => {
  return (
    <>
      <Table
        cellPadding={0}
        cellSpacing={0}
        style={{
          maxWidth: "fit-content",
          margin: "0",
          padding: "0",
          marginRight: "auto",
          minWidth: "330px",
        }}
      >
        <thead>
          <tr className="table">
            <th style={{ fontSize: "36px", paddingLeft: "24px" }}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="w-25" scope="row">
              Code
            </th>
            <td className="w-25">
              <EditableField
                name="code"
                type="text"
                placeholder="invoice code"
                value={values.code}
                onChange={handleChange}
                editMode={editMode}
              />
            </td>
          </tr>
          <tr className="w-25">
            <th className="w-25" scope="row">
              Date
            </th>
            <td className="w-25">
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
            </td>
          </tr>
          <tr className="w-25">
            <th className="w-25" scope="row">
              Due Date
            </th>
            <td className="w-25">
              <EditableField
                id="dueDate"
                name="dueDate"
                placeholder="February 1st, 2023"
                type="date"
                value={values.dueDate}
                min={values.date}
                onChange={handleChange}
                editMode={editMode}
                required
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <Table
        cellPadding={0}
        cellSpacing={0}
        style={{
          maxWidth: "fit-content",
          margin: "0",
          padding: "0",
          marginRight: "auto",
        }}
      >
        <thead style={{ backgroundColor: "lightblue !important" }}></thead>
        <tbody></tbody>
      </Table>
    </>
  );
};

export default InvoiceDetails;
