import EditableField, { EditableTextArea } from "../../helpers/EditableField";
import { Button, Table, Container, Row, Col } from "reactstrap";

const ItemTable = ({
  values,
  editMode,
  handleItemChange,
  handleAdd,
  handleRemove,
  getTotal,
}) => {
  return (
    <Container>
      <Row>
        <Col>
          <Table
            size="lg"
            hover
            borderless
            striped
            className="itemTable"
            style={{ fontSize: "1em" }}
          >
            <thead>
              <tr>
                <th>Item/Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {values.items.map((item, i) => (
                <tr key={i}>
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
                  <td className="table-responsive">
                    <EditableField
                      type="text"
                      placeholder="quantity"
                      name="quantity"
                      pattern={/[0-9][.]{1}[0-9]||[0-9]/}
                      value={item.quantity}
                      onChange={(value) =>
                        handleItemChange(i, "quantity", value)
                      }
                      editMode={editMode}
                      min={0}
                      max={Infinity}
                      step={0.01}
                    />
                  </td>
                  <td className="table-responsive">
                    <EditableField
                      type="text"
                      placeholder="rate"
                      pattern={/[0-9][.]{1}[0-9]||[0-9]/}
                      name="rate"
                      value={item.rate}
                      onChange={(value) => handleItemChange(i, "rate", value)}
                      editMode={editMode}
                      min={0}
                      max={Infinity}
                      step={0.01}
                    />
                  </td>
                  <td>
                    <div>{getTotal(+item.quantity, +item.rate)}</div>
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <div style={{ margin: "auto", textAlign: "center" }}>
        {editMode ? (
          <Button className="add" onClick={handleAdd}>
            +
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </Container>
  );
};

export default ItemTable;
