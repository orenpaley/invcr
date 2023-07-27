// export const initialValues = {
//   name: "John Doe",
//   address: "123 example st." + "\n" + "anytown, US, 12345",
//   email: "john@doe.com",
//   clientName: "Jane Da",
//   clientAddress: "789 something park" + "\n" + "anytown, US, 12345",
//   clientEmail: "jane@da.com",
//   code: "",
//   date: "2023-01-01",
//   dueDate: "2023-02-01",
//   items: [
//     {
//       description: "item 1 + description",
//       rate: 35,
//       quantity: 8,
//       get itemTotal() {
//         return this.itemRate * this.itemQuantity;
//       },
//     },
//     {
//       description: "item 2 + description",
//       rate: 50,
//       quantity: 4,
//       get itemTotal() {
//         return this.itemRate * this.itemQuantity;
//       },
//     },
//   ],
//   terms: "net 30",
//   notes: "Thank you for your buisness",
//   taxRate: 0.11,
// };

export const initialItem = {
  description: "",
  quantity: "Qty",
  rate: "Rate",
};

export const initialValuesClear = {
  name: "",
  address: "",
  email: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  code: "",
  date: "",
  dueDate: "",
  items: [initialItem],
  terms: "",
  notes: "",
  taxRate: 0,
};
