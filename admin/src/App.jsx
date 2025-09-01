import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import UploadArticle from './pages/UploadArticle';
import ArticleList from './pages/ArticleList';

function App() {
  return (
    <div className="App">
      <Header />
      
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadArticle />} />
          <Route path="/articles" element={<ArticleList />} />
        </Routes>
      </Container>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
