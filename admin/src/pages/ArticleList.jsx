import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    featured: ''
  });

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      if (filter.featured) params.append('featured', filter.featured);

      const response = await axios.get(`http://localhost:5000/api/articles?${params}`);
      if (response.data.success) {
        setArticles(response.data.data);
      } else {
        toast.error('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/articles/${selectedArticle.id}`);
      if (response.data.success) {
        toast.success('Article deleted successfully');
        fetchArticles();
        setShowDeleteModal(false);
        setSelectedArticle(null);
      } else {
        toast.error('Failed to delete article');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete article');
    }
  };

  const toggleFeatured = async (article) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/articles/${article.id}`, {
        featured: !article.featured
      });
      if (response.data.success) {
        toast.success(`Article ${!article.featured ? 'marked as featured' : 'removed from featured'}`);
        fetchArticles();
      } else {
        toast.error('Failed to update article');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update article');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      published: 'success',
      draft: 'warning',
      archived: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading articles...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Articles</h2>
        <Button variant="primary" href="/upload">
          📄 Upload New Article
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filter.category}
                  onChange={(e) => setFilter({...filter, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="সাধারণ">সাধারণ</option>
                  <option value="জাতীয়">জাতীয়</option>
                  <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
                  <option value="অর্থনীতি">অর্থনীতি</option>
                  <option value="খেলা">খেলা</option>
                  <option value="বিনোদন">বিনোদন</option>
                  <option value="প্রযুক্তি">প্রযুক্তি</option>
                  <option value="মতামত">মতামত</option>
                  <option value="সম্পাদকীয়">সম্পাদকীয়</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filter.status}
                  onChange={(e) => setFilter({...filter, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Featured</Form.Label>
                <Form.Select
                  value={filter.featured}
                  onChange={(e) => setFilter({...filter, featured: e.target.value})}
                >
                  <option value="">All Articles</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Non-Featured</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                onClick={() => setFilter({category: '', status: '', featured: ''})}
                className="w-100"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Articles Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Articles ({articles.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {articles.length > 0 ? (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td>
                      <div>
                        <strong>{article.title}</strong>
                        {article.subtitle && (
                          <div className="text-muted small">{article.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td>{article.author}</td>
                    <td>
                      <Badge bg="secondary" className="bengali-text">
                        {article.category}
                      </Badge>
                    </td>
                    <td>{getStatusBadge(article.status)}</td>
                    <td>
                      <Button
                        variant={article.featured ? "warning" : "outline-warning"}
                        size="sm"
                        onClick={() => toggleFeatured(article)}
                      >
                        {article.featured ? "⭐" : "☆"}
                      </Button>
                    </td>
                    <td>{article.views || 0}</td>
                    <td>{formatDate(article.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        {article.pdfUrl && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`http://localhost:5000${article.pdfUrl}`}
                            target="_blank"
                          >
                            📄
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article);
                            setShowDeleteModal(true);
                          }}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No articles found</p>
              <Button variant="primary" href="/upload">
                Upload Your First Article
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArticle && (
            <p>
              Are you sure you want to delete the article "<strong>{selectedArticle.title}</strong>"?
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Article
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArticleList;
