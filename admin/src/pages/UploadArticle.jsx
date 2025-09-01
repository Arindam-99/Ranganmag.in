import React, { useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import axios from "axios";

const UploadArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    category: "সাধারণ",
    description: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((error) => error.code === "file-too-large")) {
        toast.error("File too large. Maximum size allowed is 100MB.");
      } else if (
        rejection.errors.some((error) => error.code === "file-invalid-type")
      ) {
        toast.error("Please select a valid PDF file");
      } else {
        toast.error("File rejected. Please try again.");
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      // Additional size check (100MB = 104857600 bytes)
      if (file.size > 104857600) {
        toast.error("File too large. Maximum size allowed is 100MB.");
        return;
      }
      setSelectedFile(file);
      toast.success(
        `PDF file selected successfully! (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB)`
      );
    } else {
      toast.error("Please select a valid PDF file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 104857600, // 100MB in bytes
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter article title");
      return;
    }

    if (!formData.author.trim()) {
      toast.error("Please enter author name");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      uploadData.append("title", formData.title);
      uploadData.append("subtitle", formData.subtitle);
      uploadData.append("author", formData.author);
      uploadData.append("category", formData.category);
      uploadData.append("description", formData.description);
      uploadData.append("featured", formData.featured);

      // Upload with progress tracking and extended timeout for large files
      const response = await axios.post(
        "http://localhost:5000/api/articles/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes timeout for large files
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        toast.success("Article uploaded successfully!");

        // Reset form
        setFormData({
          title: "",
          subtitle: "",
          author: "",
          category: "সাধারণ",
          description: "",
          featured: false,
        });
        setSelectedFile(null);
        setUploadProgress(0);
      } else {
        toast.error(response.data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Handle different types of errors
      if (error.code === "ECONNABORTED") {
        toast.error(
          "Upload timeout. Please try again with a smaller file or check your internet connection."
        );
      } else if (error.response?.status === 413) {
        toast.error("File too large. Maximum size allowed is 100MB.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Invalid file or form data.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          "Upload failed. Please check your internet connection and try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    toast.info("File removed");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upload New Article</h2>
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h5 className="mb-0">📄 Article Upload Form</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Article Details */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Article Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter article title in Bengali"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subtitle</Form.Label>
                      <Form.Control
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="Enter subtitle (optional)"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Author *</Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Enter author name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
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
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the article (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    label="Mark as featured article"
                  />
                </Form.Group>

                {/* File Upload Area */}
                <div className="mb-4">
                  <Form.Label>PDF File *</Form.Label>
                  {!selectedFile ? (
                    <div
                      {...getRootProps()}
                      className={`upload-area ${
                        isDragActive ? "drag-active" : ""
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="upload-icon">📄</div>
                      <h5>
                        {isDragActive
                          ? "Drop the PDF file here..."
                          : "Drag & drop PDF file here, or click to select"}
                      </h5>
                      <p className="text-muted">
                        Only PDF files are accepted. Maximum file size: 100MB
                      </p>
                    </div>
                  ) : (
                    <div className="file-preview">
                      <div className="file-info">
                        <div className="file-icon">📄</div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{selectedFile.name}</h6>
                          <small className="text-muted">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={removeFile}
                          disabled={uploading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="progress-container mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <ProgressBar now={uploadProgress} animated />
                  </div>
                )}

                {/* Submit Button */}
                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Uploading Article...
                      </>
                    ) : (
                      "📤 Upload Article"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UploadArticle;
