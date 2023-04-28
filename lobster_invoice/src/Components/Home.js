import Invoice from "./Invoice/Invoice";
import pdfGenerator from "./Invoice/invoiceHelpers";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  console.log("LOCATION", location);
  return <Invoice generatePdf={pdfGenerator} data={location.state || null} />;
}

export default Home;
