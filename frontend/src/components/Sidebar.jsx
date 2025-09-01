import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const Sidebar = () => {
  // Sample page thumbnails data
  const pageData = [
    { id: 1, title: "Page 1", thumbnail: "/api/placeholder/150/200" },
    { id: 2, title: "Page 2", thumbnail: "/api/placeholder/150/200" },
    { id: 3, title: "Page 3", thumbnail: "/api/placeholder/150/200" },
    { id: 4, title: "Page 4", thumbnail: "/api/placeholder/150/200" },
    { id: 5, title: "Page 5", thumbnail: "/api/placeholder/150/200" },
    { id: 6, title: "Page 6", thumbnail: "/api/placeholder/150/200" },
    { id: 7, title: "Page 7", thumbnail: "/api/placeholder/150/200" }
  ];

  const quickLinks = [
    { title: "আজকের পত্রিকা", link: "#", badge: "নতুন" },
    { title: "গতকালের পত্রিকা", link: "#" },
    { title: "সাপ্তাহিক সংস্করণ", link: "#" },
    { title: "মাসিক সংস্করণ", link: "#" },
    { title: "বিশেষ সংস্করণ", link: "#", badge: "জনপ্রিয়" }
  ];

  return (
    <div className="sidebar">
      {/* Page Thumbnails */}
      <Card className="mb-4">
        <Card.Header className="bg-danger text-white">
          <h5 className="mb-0 bengali-text">আজকের পত্রিকা</h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            {pageData.map(page => (
              <div key={page.id} className="col-6 mb-3">
                <div 
                  className="page-thumbnail bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '120px', cursor: 'pointer' }}
                  onClick={() => console.log(`Clicked page ${page.id}`)}
                >
                  <div className="text-center">
                    <div className="bg-secondary text-white p-2 rounded mb-2">
                      <i className="fas fa-file-pdf fa-2x"></i>
                    </div>
                    <small className="bengali-text">{page.title}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Quick Links */}
      <Card className="mb-4">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0 bengali-text">দ্রুত লিংক</h5>
        </Card.Header>
        <ListGroup variant="flush">
          {quickLinks.map((link, index) => (
            <ListGroup.Item 
              key={index} 
              action 
              href={link.link}
              className="d-flex justify-content-between align-items-center"
            >
              <span className="bengali-text">{link.title}</span>
              {link.badge && (
                <Badge bg={link.badge === 'নতুন' ? 'success' : 'primary'} className="bengali-text">
                  {link.badge}
                </Badge>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      {/* Today's Highlights */}
      <Card>
        <Card.Header className="bg-warning text-dark">
          <h5 className="mb-0 bengali-text">আজকের হাইলাইট</h5>
        </Card.Header>
        <Card.Body>
          <ul className="list-unstyled">
            <li className="mb-2">
              <small className="bengali-text">
                <strong>প্রধান সংবাদ:</strong> স্বাধীনতার ৫৩ বছর
              </small>
            </li>
            <li className="mb-2">
              <small className="bengali-text">
                <strong>অর্থনীতি:</strong> রপ্তানি আয় বৃদ্ধি
              </small>
            </li>
            <li className="mb-2">
              <small className="bengali-text">
                <strong>খেলা:</strong> ক্রিকেট বিশ্বকাপের প্রস্তুতি
              </small>
            </li>
            <li className="mb-2">
              <small className="bengali-text">
                <strong>আবহাওয়া:</strong> আজ বৃষ্টির সম্ভাবনা
              </small>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar;
