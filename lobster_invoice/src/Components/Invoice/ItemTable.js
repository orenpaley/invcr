import EditableField, { EditableTextArea } from "../../helpers/EditableField";

import { Button, Table } from "reactstrap";

const ItemTable = ({
  values,
  editMode,
  handleItemChange,
  handleAdd,
  handleRemove,
  getTotal,
}) => {
  return (
    <>
      <Table
        size="lg"
        hover
        borderless
        striped
        className="itemTable"
        style={{ fontSize: "14px", minWidth: "550px" }}
      >
        <thead>
          <tr className="w-auto">
            <th className="w=auto">Item/Description</th>
            <th className="w=auto">Quantity</th>
            <th className="w=auto">Rate</th>
            <th className="w=auto">Total</th>
          </tr>
        </thead>
        <tbody>
          {values.items.map((item, i) => {
            return (
              <tr key={i} style={{ marginTop: "60px" }}>
                <td>
                  <EditableTextArea
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
                    onChange={(value) => handleItemChange(i, "quantity", value)}
                    editMode={editMode}
                    min={0}
                  />
                </td>
                <td>
                  <EditableField
                    type="number"
                    pattern="[0-9]"
                    placeholder="rate"
                    name="rate"
                    value={Number(item.rate)}
                    onChange={(value) => handleItemChange(i, "rate", value)}
                    editMode={editMode}
                    min={0}
                  />
                </td>
                <td>
                  <div>{getTotal(+item.quantity, +item.rate)}</div>
                </td>
                <tr>
                  {editMode ? (
                    <Button
                      className="remove"
                      style={{
                        color: "black",
                        border: "1px solid red",
                        margin: "0",
                        backgroundColor: "inherit",
                      }}
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
                      style={{
                        color: "black",
                        border: "1px solid red",
                      }}
                      onClick={() => {
                        handleRemove(i);
                      }}
                    >
                      X
                    </Button>
                  )}
                </tr>
              </tr>
            );
          })}
          <div></div>
        </tbody>
      </Table>
      <div style={{ margin: "auto", textAlign: "center" }}>
        {editMode ? (
          <Button
            className="add"
            style={{
              fontSize: "22px",
              backgroundColor: "#198754",
              textAlign: "center",
              margin: "8px",
              padding: "6px 16px",
              margin: "8px",
              minWidth: "300px",
            }}
            onClick={handleAdd}
          >
            +
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default ItemTable;
