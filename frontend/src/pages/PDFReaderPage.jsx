import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import mobileLogo from "../assets/logo.png";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PDFReaderPage() {
  const { id } = useParams();
  const [article, setArticle] = useState({ pdfUrl: "" });
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch article data from backend by ID
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/articles/${id}`
        );
        const result = await response.json();
        if (result.success && result.data) {
          setArticle(result.data);
        } else {
          setArticle({ pdfUrl: "" });
        }
      } catch (error) {
        setArticle({ pdfUrl: "" });
      }
    };
    fetchArticle();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Responsive width for PDF page
  const getPageWidth = () => {
    if (typeof window === "undefined") return 320;
    if (window.innerWidth < 500) return window.innerWidth - 32; // mobile
    if (window.innerWidth < 900) return 400; // tablet
    return 600; // desktop
  };

  // Ensure correct PDF URL (prepend backend URL if needed)
  const getFullPdfUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="pdf-reader-page" style={{ margin: 0, padding: 0 }}>
      {/* Minimal Header */}
      <div className="pdf-article-header bg-white border-bottom p-2 sticky-top">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-6">
              <Link
                to="/"
                className="btn btn-outline-danger btn-sm bengali-text"
              >
                ← প্রচ্ছদে ফিরুন
              </Link>
            </div>
            <div className="col-6 text-end">
              <Link to="/">
                <img
                  src={mobileLogo}
                  alt="প্রতিদিন"
                  style={{ maxHeight: "30px" }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main PDF Viewer */}
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{
          background: "#f8f9fa",
          minHeight: "320px",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      >
        <Document
          file={getFullPdfUrl(article.pdfUrl)}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 bengali-text">PDF লোড হচ্ছে...</p>
            </div>
          }
          error={
            <div className="text-center py-5">
              <div className="alert alert-danger bengali-text">
                PDF লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।
              </div>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={getPageWidth()}
            renderAnnotationLayer={false}
            renderTextLayer={true}
            className="pdf-page-display"
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              display: "block",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "4px",
              background: "white",
            }}
          />
        </Document>
      </div>

      {/* Page Navigation */}
      <div
        className="w-100 d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3"
        style={{ marginTop: 8 }}
      >
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← পূর্ববর্তী
        </button>

        {Array.from({ length: numPages || 0 }, (_, idx) => idx + 1)
          .slice(
            Math.max(0, currentPage - 2),
            Math.min(numPages, currentPage + 1)
          )
          .map((pageNum) => (
            <button
              key={pageNum}
              className={`btn btn-sm mx-1 ${
                currentPage === pageNum ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setCurrentPage(pageNum)}
              disabled={currentPage === pageNum}
            >
              {pageNum}
            </button>
          ))}

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
          disabled={currentPage === numPages}
        >
          পরবর্তী →
        </button>
      </div>
    </div>
  );
}

export default PDFReaderPage;
