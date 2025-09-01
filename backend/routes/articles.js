const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const router = express.Router();

// Sample articles data (in production, this would come from a database)
let articles = [
  {
    id: 1,
    title: "স্বাধীনতার ৫৩ বছর",
    subtitle: "বাংলাদেশের অগ্রযাত্রা",
    content:
      "বাংলাদেশের স্বাধীনতার ৫৩ বছর পূর্ণ হয়েছে। এই দীর্ঘ সময়ে দেশ অনেক উন্নতি করেছে।",
    author: "সম্পাদকীয় বিভাগ",
    date: "2024-03-26",
    category: "সম্পাদকীয়",
    featured: true,
    pdfUrl: null,
    imageUrl: null,
  },
  {
    id: 2,
    title: "অর্থনৈতিক উন্নয়ন",
    subtitle: "নতুন দিগন্তের সন্ধানে",
    content:
      "দেশের অর্থনৈতিক উন্নয়নে নতুন মাত্রা যোগ হয়েছে। রপ্তানি আয় বৃদ্ধি পেয়েছে।",
    author: "অর্থনীতি সংবাদদাতা",
    date: "2024-03-25",
    category: "অর্থনীতি",
    featured: false,
    pdfUrl: null,
    imageUrl: null,
  },
];

// Get all articles
router.get("/", (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    let filteredArticles = [...articles];

    if (category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === "true") {
      filteredArticles = filteredArticles.filter((article) => article.featured);
    }

    if (limit) {
      filteredArticles = filteredArticles.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: filteredArticles,
      total: filteredArticles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch articles",
    });
  }
});

// Get single article
router.get("/:id", (req, res) => {
  try {
    const article = articles.find((a) => a.id === parseInt(req.params.id));

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch article",
    });
  }
});

// Create new article
router.post("/", (req, res) => {
  try {
    const { title, subtitle, content, author, category, featured } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        error: "Title, content, and author are required",
      });
    }

    const newArticle = {
      id: articles.length + 1,
      title,
      subtitle: subtitle || "",
      content,
      author,
      date: new Date().toISOString().split("T")[0],
      category: category || "সাধারণ",
      featured: featured || false,
      pdfUrl: null,
      imageUrl: null,
    };

    articles.push(newArticle);

    res.status(201).json({
      success: true,
      data: newArticle,
      message: "Article created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create article",
    });
  }
});

module.exports = router;
