import { Form, Col, Label } from "reactstrap";
import EditableField, { EditableTextArea } from "../../helpers/EditableField";
const ClientDetails = ({
  values,
  handleClientChange,
  clients,
  editMode,
  handleChange,
  user,
}) => {
  return (
    <div>
      <p className="invoice-sub-header">To</p>
      <Col>
        {editMode && user.id ? (
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              handleClientChange(e);
            }}
          >
            <option default disabled>
              select client...
            </option>
            {clients.map((client) => (
              <option value={client.id} key={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            hidden
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              handleClientChange(e);
            }}
          >
            <option default disabled>
              select client...
            </option>
            {clients.map((client) => (
              <option value={client.id} key={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        )}
      </Col>

      <div>
        <Label
          style={{ height: "0", margin: "0", padding: "0" }}
          for="clientName"
          hidden
        >
          Client Name
        </Label>
        <EditableField
          id="clientName"
          name="clientName"
          placeholder="Name"
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
        <EditableTextArea
          type="text"
          name="clientAddress"
          placeholder={"address line 1 \naddress line 2\naddress line 3"}
          value={values.clientAddress}
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
          placeholder="Email"
          type="email"
          value={values.clientEmail}
          onChange={handleChange}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default ClientDetails;
