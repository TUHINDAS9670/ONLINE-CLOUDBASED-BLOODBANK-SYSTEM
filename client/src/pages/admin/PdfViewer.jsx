import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker setup (required for PDF rendering)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  return (
    <div className="border p-4 rounded bg-gray-100">
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF.</p>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
