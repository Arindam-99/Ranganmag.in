import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker - try CDN with https
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SimplePDFTest = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("SimplePDFTest: PDF loaded successfully", { numPages, pdfUrl });
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error("SimplePDFTest: Error loading PDF", error, { pdfUrl });
    setError(error.message || "Failed to load PDF");
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <p>Loading PDF...</p>
        <p className="small text-muted">URL: {pdfUrl}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>PDF Load Error</h5>
        <p>Error: {error}</p>
        <p>URL: {pdfUrl}</p>
      </div>
    );
  }

  return (
    <div className="simple-pdf-test">
      <div className="mb-3">
        <h5>Simple PDF Test</h5>
        <p>URL: {pdfUrl}</p>
        <p>Pages: {numPages}</p>
        <p>Current Page: {pageNumber}</p>
      </div>

      <div className="text-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div>Loading document...</div>}
          error={<div>Failed to load PDF!</div>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={1.0}
          />
        </Document>
      </div>

      {numPages && (
        <div className="text-center mt-3">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="btn btn-sm btn-secondary me-2"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="btn btn-sm btn-secondary ms-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SimplePDFTest;
