import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import fullLogo from "../assets/fulllogo.png";
import mobileLogo from "../assets/logo.png";
import IframePDFViewer from "../components/IframePDFViewer";
import SinglePagePDFViewer from "../components/SinglePagePDFViewer";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [sideArticles, setSideArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/articles?status=published"
      );
      if (response.data.success) {
        const allArticles = response.data.data;
        setArticles(allArticles);

        // Set featured article (most recent one)
        if (allArticles.length > 0) {
          setFeaturedArticle(allArticles[0]);
          setSideArticles(allArticles.slice(1, 11)); // Next 10 articles for sidebar
        }

        setError(null);
      } else {
        setError("কোন নিবন্ধ পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।"
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

  if (error) {
    return (
      <div className="newspaper-layout">
        <div className="text-center py-5">
          <div className="alert alert-warning bengali-text">{error}</div>
        </div>
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

      {/* Main Content */}
      <main className="newspaper-main">
        <div className="container-fluid">
          <div className="row">
            {/* Main Article Area */}
            <div className="col-lg-8 col-md-7">
              {featuredArticle && featuredArticle.pdfUrl ? (
                /* PDF Article Viewer - Shows Page 1 automatically with navigation cards */
                <SinglePagePDFViewer article={featuredArticle} />
              ) : featuredArticle ? (
                /* Regular Article Display */
                <article className="featured-article mb-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="mb-3">
                        <span className="badge bg-danger bengali-text mb-2">
                          প্রধান সংবাদ
                        </span>
                        <h1 className="newspaper-headline bengali-text mb-3">
                          {featuredArticle.title}
                        </h1>
                        {featuredArticle.subtitle && (
                          <h2 className="newspaper-subheadline bengali-text text-muted mb-3">
                            {featuredArticle.subtitle}
                          </h2>
                        )}
                      </div>

                      <div className="article-meta mb-3 d-flex justify-content-between align-items-center">
                        <small className="bengali-text text-muted">
                          <strong>লেখক:</strong> {featuredArticle.author}
                        </small>
                        <small className="bengali-text text-muted">
                          {formatDate(featuredArticle.date)}
                        </small>
                      </div>

                      <div
                        className="article-content bengali-text"
                        style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                      >
                        <p>
                          {featuredArticle.description ||
                            (featuredArticle.content &&
                            featuredArticle.content.length > 300
                              ? `${featuredArticle.content.substring(
                                  0,
                                  300
                                )}...`
                              : featuredArticle.content)}
                        </p>
                      </div>

                      <div className="mt-3">
                        <Link
                          to={`/article/${featuredArticle.id}`}
                          className="btn btn-danger bengali-text"
                        >
                          সম্পূর্ণ পড়ুন →
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </article>
              ) : (
                <div className="text-center py-5">
                  <p className="bengali-text text-muted">
                    কোন নিবন্ধ পাওয়া যায়নি
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar with Previous Articles */}
            <div className="col-lg-4 col-md-5">
              <div className="newspaper-sidebar">
                <div className="sidebar-section mb-4">
                  <h3 className="sidebar-title bengali-text mb-3">
                    পূর্বের সংবাদ
                  </h3>

                  {sideArticles.length > 0 ? (
                    <div className="previous-articles">
                      {sideArticles.map((article, index) => (
                        <div key={article.id} className="sidebar-article mb-3">
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-start">
                                <span className="article-number me-2 text-danger fw-bold">
                                  {index + 2}
                                </span>
                                <div className="flex-grow-1">
                                  <h6 className="bengali-text mb-2 lh-sm">
                                    <Link
                                      to={
                                        article.pdfUrl
                                          ? `/pdf/${article.id}`
                                          : `/article/${article.id}`
                                      }
                                      className="text-decoration-none text-dark"
                                    >
                                      {article.pdfUrl && (
                                        <span className="text-danger me-1">
                                          📄
                                        </span>
                                      )}
                                      {article.title}
                                    </Link>
                                  </h6>

                                  {article.description && (
                                    <p className="bengali-text text-muted small mb-2">
                                      {article.description.length > 80
                                        ? `${article.description.substring(
                                            0,
                                            80
                                          )}...`
                                        : article.description}
                                    </p>
                                  )}

                                  <div className="article-meta d-flex justify-content-between align-items-center">
                                    <small className="bengali-text text-muted">
                                      {article.author}
                                    </small>
                                    <small className="bengali-text text-muted">
                                      {formatDate(article.date)}
                                    </small>
                                  </div>

                                  {article.views && (
                                    <small className="text-muted">
                                      👁️ {article.views}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="bengali-text text-muted text-center py-4">
                      কোন পূর্বের সংবাদ পাওয়া যায়নি
                    </p>
                  )}
                </div>

                {/* Archive Section */}
                <div className="sidebar-section">
                  <h3 className="sidebar-title bengali-text mb-3">আর্কাইভ</h3>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                      <p className="bengali-text text-center text-muted">
                        সকল পুরাতন সংবাদ দেখতে আর্কাইভ বিভাগে যান
                      </p>
                      <div className="text-center">
                        <Link
                          to="/archive"
                          className="btn btn-outline-danger btn-sm bengali-text"
                        >
                          আর্কাইভ দেখুন
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
