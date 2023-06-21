import EditableField, { EditableTextArea } from "../../helpers/EditableField";
import { Label } from "reactstrap";

const BillingDetails = ({ values, editMode, handleChange, custom }) => {
  return (
    <>
      <div>
        <p className="invoice-sub-header">From</p>
        <Label for="name" hidden>
          Name
        </Label>
        <EditableField
          id="name"
          name="name"
          placeholder="Name"
          type="text"
          value={values.name}
          onChange={handleChange}
          editMode={editMode}
        />

        <div className="group">
          <Label for="address" hidden>
            Address
          </Label>
          <span>
            <EditableTextArea
              type="textarea"
              name="address"
              placeholder={"address line 1 \naddress line 2\naddress line 3"}
              value={values.address}
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
      </div>
    </>
  );
};

export default BillingDetails;
