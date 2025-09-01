const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- Security Middleware ----------------
app.use(
  helmet({
    contentSecurityPolicy: false, // allow PDFs in iframes
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow cross-origin resource sharing
    frameguard: false, // disable X-Frame-Options header
  })
);

// ---------------- Rate Limiting ----------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  skip: (req) => req.path.includes("/upload"), // don't limit uploads
});
app.use(limiter);

// ---------------- CORS ----------------
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8082",
    ],
    credentials: true,
  })
);

// ---------------- Body Parsing ----------------
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ---------------- Static File Serving (PDFs) ----------------
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Cache-Control", "public, max-age=31536000"); // cache PDFs
        // Remove X-Frame-Options if set by default
        res.removeHeader && res.removeHeader("X-Frame-Options");
        res.setHeader("X-Frame-Options", "ALLOWALL");
      }
    },
  })
);

// ---------------- Routes ----------------
app.use("/api/articles", require("./routes/articles-new"));
// app.use("/api/upload", require("./routes/upload")); // enable when Firebase is ready

// ---------------- Health Check ----------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Ranganmag API is running",
    timestamp: new Date().toISOString(),
  });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ---------------- 404 Handler ----------------
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Ranganmag server running on port ${PORT}`);
  console.log(`📰 Environment: ${process.env.NODE_ENV || "development"}`);
});
