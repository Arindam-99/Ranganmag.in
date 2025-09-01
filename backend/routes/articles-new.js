const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { exec } = require("child_process");
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const articlesDataFile = path.join(__dirname, "../data/articles.json");

// Initialize directories and data file
const initializeStorage = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(path.dirname(articlesDataFile), { recursive: true });

    // Check if articles data file exists, if not create it
    try {
      await fs.access(articlesDataFile);
    } catch {
      const initialData = {
        articles: [
          {
            id: 1,
            title: "স্বাধীনতার ৫৩ বছর",
            subtitle: "বাংলাদেশের অগ্রযাত্রা",
            description:
              "বাংলাদেশের স্বাধীনতার ৫৩ বছর পূর্ণ হয়েছে। এই দীর্ঘ সময়ে দেশ অনেক উন্নতি করেছে।",
            author: "সম্পাদকীয় বিভাগ",
            date: "2024-03-26",
            category: "সম্পাদকীয়",
            featured: true,
            status: "published",
            pdfUrl: null,
            localPdfPath: null,
            firebasePdfUrl: null,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: "অর্থনৈতিক উন্নয়ন",
            subtitle: "নতুন দিগন্তের সন্ধানে",
            description:
              "দেশের অর্থনৈতিক উন্নয়নে নতুন মাত্রা যোগ হয়েছে। রপ্তানি আয় বৃদ্ধি পেয়েছে।",
            author: "অর্থনীতি সংবাদদাতা",
            date: "2024-03-25",
            category: "অর্থনীতি",
            featured: false,
            status: "published",
            pdfUrl: null,
            localPdfPath: null,
            firebasePdfUrl: null,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        lastId: 2,
      };
      await fs.writeFile(
        articlesDataFile,
        JSON.stringify(initialData, null, 2)
      );
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

// Load articles from file
const loadArticles = async () => {
  try {
    const data = await fs.readFile(articlesDataFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading articles:", error);
    return { articles: [], lastId: 0 };
  }
};

// Save articles to file
const saveArticles = async (data) => {
  try {
    await fs.writeFile(articlesDataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving articles:", error);
  }
};

// Initialize storage on module load
initializeStorage();

// Function to regenerate static site
const regenerateStaticSite = () => {
  const staticSiteDir = path.join(__dirname, "../../static-site");

  return new Promise((resolve, reject) => {
    exec(
      "npm run generate",
      { cwd: staticSiteDir },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error regenerating static site:", error);
          reject(error);
        } else {
          console.log("✅ Static site regenerated successfully");
          console.log(stdout);
          resolve(stdout);
        }
      }
    );
  });
};

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedTitle = req.body.title
      ? req.body.title.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, "_")
      : "article";
    const filename = `${timestamp}_${sanitizedTitle}.pdf`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for large PDF files
    fieldSize: 10 * 1024 * 1024, // 10MB for form fields
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Get all articles
router.get("/", async (req, res) => {
  try {
    const { category, featured, limit, status } = req.query;
    const data = await loadArticles();
    let filteredArticles = [...data.articles];

    if (category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === "true") {
      filteredArticles = filteredArticles.filter((article) => article.featured);
    }

    if (status) {
      filteredArticles = filteredArticles.filter(
        (article) => article.status === status
      );
    }

    if (limit) {
      filteredArticles = filteredArticles.slice(0, parseInt(limit));
    }

    // Sort by creation date (newest first)
    filteredArticles.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      data: filteredArticles,
      total: filteredArticles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch articles",
    });
  }
});

// Get single article
router.get("/:id", async (req, res) => {
  try {
    const data = await loadArticles();
    const article = data.articles.find((a) => a.id === parseInt(req.params.id));

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    // Increment view count
    article.views = (article.views || 0) + 1;
    await saveArticles(data);

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch article",
    });
  }
});

// Upload new article with PDF
router.post(
  "/upload",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            error: "File too large. Maximum size allowed is 100MB.",
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No PDF file uploaded",
        });
      }

      const { title, subtitle, author, category, description, featured } =
        req.body;

      if (!title || !author) {
        return res.status(400).json({
          success: false,
          error: "Title and author are required",
        });
      }

      const data = await loadArticles();
      const newId = data.lastId + 1;

      const newArticle = {
        id: newId,
        title,
        subtitle: subtitle || "",
        description: description || "",
        author,
        date: new Date().toISOString().split("T")[0],
        category: category || "সাধারণ",
        featured: featured === "true",
        status: "published",
        pdfUrl: `/uploads/${req.file.filename}`,
        localPdfPath: req.file.path,
        firebasePdfUrl: null, // Will be set when Firebase backup is implemented
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.articles.push(newArticle);
      data.lastId = newId;
      await saveArticles(data);

      // TODO: Upload to Firebase as backup
      // await uploadToFirebase(req.file.path, req.file.filename);

      // Regenerate static site in background
      regenerateStaticSite().catch((error) => {
        console.error("Failed to regenerate static site:", error);
      });

      res.status(201).json({
        success: true,
        data: newArticle,
        message:
          "Article uploaded successfully. Static site will be updated shortly.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to upload article",
        details: error.message,
      });
    }
  }
);

// Update article
router.put("/:id", async (req, res) => {
  try {
    const data = await loadArticles();
    const articleIndex = data.articles.findIndex(
      (a) => a.id === parseInt(req.params.id)
    );

    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    const updatedArticle = {
      ...data.articles[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    data.articles[articleIndex] = updatedArticle;
    await saveArticles(data);

    res.json({
      success: true,
      data: updatedArticle,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update article",
    });
  }
});

// Delete article
router.delete("/:id", async (req, res) => {
  try {
    const data = await loadArticles();
    const articleIndex = data.articles.findIndex(
      (a) => a.id === parseInt(req.params.id)
    );

    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    const article = data.articles[articleIndex];

    // Delete local PDF file
    if (article.localPdfPath) {
      try {
        await fs.unlink(article.localPdfPath);
      } catch (error) {
        console.error("Error deleting local file:", error);
      }
    }

    // Remove from articles array
    data.articles.splice(articleIndex, 1);
    await saveArticles(data);

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete article",
    });
  }
});

module.exports = router;
