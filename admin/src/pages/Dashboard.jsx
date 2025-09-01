import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch articles for stats
      const articlesResponse = await axios.get('http://localhost:5000/api/articles');
      if (articlesResponse.data.success) {
        const articles = articlesResponse.data.data;
        setStats({
          totalArticles: articles.length,
          publishedArticles: articles.filter(a => a.status === 'published').length,
          draftArticles: articles.filter(a => a.status === 'draft').length,
          totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0)
        });
        
        // Get recent articles (last 5)
        setRecentArticles(articles.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data for development
      setStats({
        totalArticles: 12,
        publishedArticles: 10,
        draftArticles: 2,
        totalViews: 1250
      });
      setRecentArticles([
        {
          id: 1,
          title: "স্বাধীনতার ৫৩ বছর",
          date: "2024-03-26",
          status: "published"
        },
        {
          id: 2,
          title: "অর্থনৈতিক উন্নয়ন",
          date: "2024-03-25",
          status: "published"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Button as={Link} to="/upload" variant="primary">
          📄 Upload New Article
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number">{stats.totalArticles}</div>
              <div className="stats-label">Total Articles</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number text-success">{stats.publishedArticles}</div>
              <div className="stats-label">Published</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number text-warning">{stats.draftArticles}</div>
              <div className="stats-label">Drafts</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number text-info">{stats.totalViews}</div>
              <div className="stats-label">Total Views</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Articles */}
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Articles</h5>
            </Card.Header>
            <Card.Body>
              {recentArticles.length > 0 ? (
                <div>
                  {recentArticles.map(article => (
                    <div key={article.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <h6 className="mb-1">{article.title}</h6>
                        <small className="text-muted">{article.date}</small>
                      </div>
                      <span className={`badge ${article.status === 'published' ? 'bg-success' : 'bg-warning'}`}>
                        {article.status}
                      </span>
                    </div>
                  ))}
                  <div className="text-center mt-3">
                    <Button as={Link} to="/articles" variant="outline-primary" size="sm">
                      View All Articles
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No articles yet</p>
                  <Button as={Link} to="/upload" variant="primary">
                    Upload Your First Article
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/upload" variant="primary">
                  📄 Upload New Article
                </Button>
                <Button as={Link} to="/articles" variant="outline-secondary">
                  📋 Manage Articles
                </Button>
                <Button variant="outline-info" onClick={fetchDashboardData}>
                  🔄 Refresh Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
