export const initialValues = {
  name: "John Doe",
  address: "123 example st.",
  cityStateZip: "Anytown, CA, 12345",
  email: "john@doe.com",
  clientName: "Jane Da",
  clientAddress: "789 something park",
  clientCityStateZip: "Somewhere, TN, 67890",
  clientEmail: "jane@da.com",
  invoiceCode: "EX-001",
  date: "2023-01-01",
  dueDate: "2023-02-01",
  items: [
    {
      itemName: "item 1 + description",
      itemRate: 35,
      itemQuantity: 8,
      get itemTotal() {
        return this.itemRate * this.itemQuantity;
      },
    },
    {
      itemName: "item 2 + description",
      itemRate: 50,
      itemQuantity: 4,
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
  itemName: "",
  itemQuantity: "Qty",
  itemRate: "Rate",
};
