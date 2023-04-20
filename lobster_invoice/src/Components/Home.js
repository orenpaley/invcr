import Invoice from "./Invoice/Invoice";
import pdfGenerator from "./Invoice/invoiceHelpers";

function Home() {
  return <Invoice generatePdf={pdfGenerator} />;
}

export default Home;
