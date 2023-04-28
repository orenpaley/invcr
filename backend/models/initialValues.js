export const initialValues = {
  firstName: "John",
  lastName: "Doe",
  address: "123 example st.",
  cityStateZip: "Anytown, CA, 12345",
  email: "john@doe.com",
  clientName: "Jane Da",
  clientAddress: "789 something park",
  clientCityStateZip: "Somewhere, TN, 67890",
  clientEmail: "jane@da.com",
  code: "EX-001",
  date: "2023-01-01",
  dueDate: "2023-02-01",
  items: [
    {
      description: "item 1 + description",
      rate: 35,
      quantity: 8,
      get itemTotal() {
        return this.itemRate * this.itemQuantity;
      },
    },
    {
      description: "item 2 + description",
      rate: 50,
      quantity: 4,
      get itemTotal() {
        return this.itemRate * this.itemQuantity;
      },
    },
  ],
  terms: "net 30",
  notes: "Thank you for your buisness",
  taxRate: 0.11,
};

export const initialItem = {
  name: "",
  quantity: "Qty",
  rate: "Rate",
};
