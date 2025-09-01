import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const ArticleCard = ({ article, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className={`article-card ${featured ? "border-danger" : ""}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge
            bg={featured ? "danger" : "secondary"}
            className="bengali-text"
          >
            {article.category}
          </Badge>
          {featured && (
            <Badge bg="warning" text="dark" className="bengali-text">
              প্রধান সংবাদ
            </Badge>
          )}
        </div>

        <Card.Title
          className={`article-title bengali-text ${featured ? "h4" : "h5"}`}
        >
          <Link
            to={`/article/${article.id}`}
            className="text-decoration-none text-dark"
          >
            {article.title}
          </Link>
        </Card.Title>

        {article.subtitle && (
          <Card.Subtitle className="article-subtitle bengali-text mb-3">
            {article.subtitle}
          </Card.Subtitle>
        )}

        <Card.Text className="bengali-text">
          {article.description
            ? article.description.length > 200
              ? `${article.description.substring(0, 200)}...`
              : article.description
            : article.content && article.content.length > 200
            ? `${article.content.substring(0, 200)}...`
            : article.content || "No description available"}
        </Card.Text>

        <div className="article-meta d-flex justify-content-between align-items-center">
          <small className="bengali-text">
            <strong>লেখক:</strong> {article.author}
          </small>
          <small className="bengali-text">{formatDate(article.date)}</small>
        </div>

        <div className="mt-3 d-flex gap-2 flex-wrap">
          <Link
            to={`/article/${article.id}`}
            className={`btn btn-sm bengali-text ${
              featured ? "btn-danger" : "btn-outline-primary"
            }`}
          >
            বিস্তারিত পড়ুন
          </Link>

          {article.pdfUrl && (
            <a
              href={`http://localhost:5000${article.pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm bengali-text"
            >
              📄 PDF দেখুন
            </a>
          )}

          {article.views && (
            <small className="text-muted align-self-center bengali-text">
              👁️ {article.views} বার পড়া হয়েছে
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;
