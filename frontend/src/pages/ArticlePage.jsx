import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import axios from "axios";
import fullLogo from "../assets/fulllogo.png";
import mobileLogo from "../assets/logo.png";
import PDFReader from "../components/PDFReader";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/articles/${id}`
      );
      if (response.data.success) {
        setArticle(response.data.data);
      } else {
        setError("Article not found");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError(
        "Failed to load article. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="newspaper-layout">
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 bengali-text">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="newspaper-layout">
        <div className="text-center py-5">
          <div className="alert alert-danger bengali-text">
            {error || "নিবন্ধ পাওয়া যায়নি"}
          </div>
          <Link to="/" className="btn btn-primary bengali-text">
            প্রচ্ছদে ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  // If article has PDF, show the PDF Reader interface
  if (article && article.pdfUrl) {
    return (
      <div className="pdf-article-layout">
        {/* Minimal Header for PDF Reader */}
        <div className="pdf-article-header bg-white border-bottom p-2">
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

        {/* PDF Reader Component */}
        <PDFReader
          pdfUrl={`http://localhost:5000${article.pdfUrl}`}
          title={article.title}
        />
      </div>
    );
  }

  return (
    <div className="newspaper-layout">
      {/* Header with Logo */}
      <header className="newspaper-header">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-12 text-center">
              <Link to="/">
                <img
                  src={fullLogo}
                  alt="প্রতিদিন"
                  className="newspaper-logo d-none d-md-block mx-auto"
                  style={{ maxHeight: "80px" }}
                />
                <img
                  src={mobileLogo}
                  alt="প্রতিদিন"
                  className="newspaper-logo d-md-none mx-auto"
                  style={{ maxHeight: "50px" }}
                />
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="newspaper-date-bar text-center py-2 border-top border-bottom">
                <span className="bengali-text text-muted">
                  {new Date().toLocaleDateString("bn-BD", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="newspaper-main">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-8 mx-auto">
              <article className="newspaper-article">
                {/* Back Button */}
                <div className="mb-4">
                  <Link
                    to="/"
                    className="btn btn-outline-danger btn-sm bengali-text"
                  >
                    ← প্রচ্ছদে ফিরুন
                  </Link>
                </div>

                {/* Article Header */}
                <header className="article-header mb-4">
                  {article.category && (
                    <Badge bg="danger" className="bengali-text mb-3">
                      {article.category}
                    </Badge>
                  )}

                  <h1 className="newspaper-headline bengali-text mb-3">
                    {article.title}
                  </h1>

                  {article.subtitle && (
                    <h2 className="newspaper-subheadline bengali-text mb-4">
                      {article.subtitle}
                    </h2>
                  )}

                  <div className="article-meta border-top border-bottom py-3 mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <small className="bengali-text text-muted">
                          <strong>লেখক:</strong> {article.author}
                        </small>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <small className="bengali-text text-muted">
                          <strong>প্রকাশিত:</strong> {formatDate(article.date)}
                        </small>
                      </div>
                      {article.views && (
                        <div className="col-12 mt-2">
                          <small className="text-muted">
                            👁️ {article.views} বার পড়া হয়েছে
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </header>

                {/* Article Content */}
                <div className="article-content">
                  {/* PDF Content Display */}
                  {article.pdfUrl ? (
                    <div className="pdf-content mb-4">
                      {/* PDF Action Buttons */}
                      <div className="pdf-actions mb-4 text-center">
                        <div className="bg-light p-3 rounded">
                          <h5 className="bengali-text text-primary mb-3">
                            📄 PDF সংবাদ
                          </h5>
                          <div className="d-flex gap-2 justify-content-center flex-wrap">
                            <a
                              href={`http://localhost:5000${article.pdfUrl}`}
                              download
                              className="btn btn-success btn-sm bengali-text"
                            >
                              💾 ডাউনলোড করুন
                            </a>
                            <button
                              onClick={() => window.print()}
                              className="btn btn-secondary btn-sm bengali-text"
                            >
                              🖨️ প্রিন্ট করুন
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Full PDF Display */}
                      <div
                        className="pdf-viewer"
                        style={{
                          height: "80vh",
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <iframe
                          src={`http://localhost:5000${article.pdfUrl}`}
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                          title={`${article.title} - PDF Document`}
                        >
                          <div className="text-center p-4">
                            <p className="bengali-text text-muted">
                              আপনার ব্রাউজার PDF প্রদর্শন সমর্থন করে না।
                            </p>
                            <a
                              href={`http://localhost:5000${article.pdfUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary bengali-text"
                            >
                              PDF খুলুন
                            </a>
                          </div>
                        </iframe>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Article Description */}
                      {article.description && (
                        <div className="mb-4">
                          <div className="bg-light p-4 rounded">
                            <h5 className="bengali-text text-primary mb-3">
                              📝 সারসংক্ষেপ
                            </h5>
                            <p
                              className="bengali-text"
                              style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                            >
                              {article.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Main Article Content */}
                      {article.content && (
                        <div
                          className="article-body bengali-text"
                          style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                        >
                          {article.content.split("\n").map(
                            (paragraph, index) =>
                              paragraph.trim() && (
                                <p
                                  key={index}
                                  className="mb-4"
                                  style={{ textAlign: "justify" }}
                                >
                                  {paragraph}
                                </p>
                              )
                          )}
                        </div>
                      )}

                      {/* If no content available */}
                      {!article.content && !article.description && (
                        <div className="text-center py-5">
                          <p className="bengali-text text-muted">
                            এই নিবন্ধের বিস্তারিত তথ্য এখনও যোগ করা হয়নি।
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Article Footer */}
                <footer className="article-footer mt-5 pt-4 border-top">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-outline-primary btn-sm bengali-text">
                          📤 শেয়ার করুন
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm bengali-text"
                          onClick={() => window.print()}
                        >
                          🖨️ প্রিন্ট করুন
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                      <small className="text-muted bengali-text">
                        আর্টিকেল ID: {article.id}
                      </small>
                    </div>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
