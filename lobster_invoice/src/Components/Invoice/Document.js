import React from "react";
import { Document as PdfDocument } from "@react-18-pdf/renderer";

const Document = ({ pdfMode, children }) => {
  return (
    <> {pdfMode ? <PdfDocument>{children}</PdfDocument> : <>{children}</>} </>
  );
};

export default Document;
