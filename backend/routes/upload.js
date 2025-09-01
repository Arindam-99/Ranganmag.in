const express = require('express');
const multer = require('multer');
const { bucket } = require('../config/firebase');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'), false);
    }
  }
});

// Upload PDF or image file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { originalname, buffer, mimetype } = req.file;
    const timestamp = Date.now();
    const fileName = `${timestamp}-${originalname}`;
    
    // Create a file reference in Firebase Storage
    const file = bucket.file(fileName);
    
    // Upload the file
    await file.save(buffer, {
      metadata: {
        contentType: mimetype,
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    res.json({
      success: true,
      data: {
        fileName,
        originalName: originalname,
        url: publicUrl,
        size: buffer.length,
        type: mimetype
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      details: error.message
    });
  }
});

// Delete file
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const file = bucket.file(fileName);
    await file.delete();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
      details: error.message
    });
  }
});

module.exports = router;
