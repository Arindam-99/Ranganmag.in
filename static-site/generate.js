const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Handlebars = require("handlebars");

const API_BASE_URL = "http://localhost:5000/api";
const DIST_DIR = path.join(__dirname, "dist");
const TEMPLATES_DIR = path.join(__dirname, "templates");

// Helper functions for Handlebars
Handlebars.registerHelper("formatDate", function (dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

Handlebars.registerHelper("truncate", function (str, length) {
  if (str && str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("concat", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1);
  return args.join("");
});

Handlebars.registerHelper("encodeURIComponent", function (str) {
  return encodeURIComponent(str);
});

class StaticSiteGenerator {
  constructor() {
    this.articles = [];
    this.templates = {};
  }

  async init() {
    console.log("🚀 Initializing static site generator...");

    // Ensure directories exist
    await fs.ensureDir(DIST_DIR);
    await fs.ensureDir(path.join(DIST_DIR, "articles"));
    await fs.ensureDir(path.join(DIST_DIR, "assets"));

    // Load templates
    await this.loadTemplates();

    // Fetch articles from API
    await this.fetchArticles();

    console.log(`📄 Found ${this.articles.length} articles`);
  }

  async loadTemplates() {
    console.log("📋 Loading templates...");

    const templateFiles = ["layout.hbs", "index.hbs", "article.hbs"];

    for (const file of templateFiles) {
      const templatePath = path.join(TEMPLATES_DIR, file);
      if (await fs.pathExists(templatePath)) {
        const templateContent = await fs.readFile(templatePath, "utf8");
        const templateName = path.basename(file, ".hbs");
        this.templates[templateName] = Handlebars.compile(templateContent);
      }
    }
  }

  async fetchArticles() {
    console.log("📡 Fetching articles from API...");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/articles?status=published`
      );
      if (response.data.success) {
        this.articles = response.data.data;
      } else {
        console.error("❌ Failed to fetch articles:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Error fetching articles:", error.message);
      // Use sample data if API is not available
      this.articles = [
        {
          id: 1,
          title: "স্বাধীনতার ৫৩ বছর",
          subtitle: "বাংলাদেশের অগ্রযাত্রা",
          description: "বাংলাদেশের স্বাধীনতার ৫৩ বছর পূর্ণ হয়েছে।",
          author: "সম্পাদকীয় বিভাগ",
          date: "2024-03-26",
          category: "সম্পাদকীয়",
          featured: true,
          pdfUrl: null,
          views: 150,
        },
      ];
    }
  }

  async generateHomePage() {
    console.log("🏠 Generating home page...");

    const featuredArticles = this.articles.filter(
      (article) => article.featured
    );
    const regularArticles = this.articles.filter(
      (article) => !article.featured
    );

    const homeData = {
      title: "রাঙ্গামাগ - আধুনিক বাংলা সংবাদপত্র",
      featuredArticles,
      regularArticles,
      totalArticles: this.articles.length,
      currentDate: new Date().toLocaleDateString("bn-BD"),
    };

    const homeContent = this.templates.index(homeData);
    const finalHtml = this.templates.layout({
      title: homeData.title,
      content: homeContent,
      isHomePage: true,
    });

    await fs.writeFile(path.join(DIST_DIR, "index.html"), finalHtml);
  }

  async generateArticlePages() {
    console.log("📄 Generating article pages...");

    for (const article of this.articles) {
      const articleData = {
        ...article,
        title: `${article.title} - রাঙ্গামাগ`,
        relatedArticles: this.articles
          .filter((a) => a.id !== article.id && a.category === article.category)
          .slice(0, 3),
      };

      const articleContent = this.templates.article(articleData);
      const finalHtml = this.templates.layout({
        title: articleData.title,
        content: articleContent,
        isArticlePage: true,
        article: articleData,
      });

      await fs.writeFile(
        path.join(DIST_DIR, "articles", `${article.id}.html`),
        finalHtml
      );
    }
  }

  async copyAssets() {
    console.log("📁 Copying assets...");

    // Copy CSS
    const cssContent = await this.generateCSS();
    await fs.writeFile(path.join(DIST_DIR, "assets", "style.css"), cssContent);

    // Copy JavaScript
    const jsContent = await this.generateJS();
    await fs.writeFile(path.join(DIST_DIR, "assets", "script.js"), jsContent);
  }

  async generateCSS() {
    return `
/* Ranganmag Static Site Styles */
:root {
  --primary-red: #dc3545;
  --dark-red: #b02a37;
  --light-gray: #f8f9fa;
  --dark-gray: #343a40;
  --border-color: #dee2e6;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: #ffffff;
}

.bengali-text {
  font-family: 'SolaimanLipi', 'Kalpurush', 'Nikosh', Arial, sans-serif;
  line-height: 1.8;
}

.site-header {
  background: linear-gradient(135deg, var(--primary-red), var(--dark-red));
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.site-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  padding: 2rem 0;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.article-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.article-card.featured {
  border-color: var(--primary-red);
  border-width: 2px;
}

.article-title {
  color: var(--text-primary);
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.article-title:hover {
  color: var(--primary-red);
}

.article-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.category-badge {
  background-color: var(--primary-red);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.featured-badge {
  background-color: #ffc107;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.pdf-viewer {
  width: 100%;
  height: 600px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin: 2rem 0;
}

.footer {
  background-color: var(--dark-gray);
  color: white;
  text-align: center;
  padding: 2rem 0;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .site-title {
    font-size: 2rem;
  }
  
  .article-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .container {
    padding: 0 0.5rem;
  }
}
    `;
  }

  async generateJS() {
    return `
// Ranganmag Static Site JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add loading animation for PDF viewers
  const pdfViewers = document.querySelectorAll('.pdf-viewer');
  pdfViewers.forEach(viewer => {
    viewer.addEventListener('load', function() {
      this.style.opacity = '1';
    });
  });

  // Add article view tracking (if needed)
  if (window.location.pathname.includes('/articles/')) {
    console.log('Article viewed:', document.title);
  }
});
    `;
  }

  async generate() {
    try {
      await this.init();
      await this.generateHomePage();
      await this.generateArticlePages();
      await this.copyAssets();

      console.log("✅ Static site generated successfully!");
      console.log(`📁 Output directory: ${DIST_DIR}`);
      console.log('🌐 Run "npm run serve" to preview the site');
    } catch (error) {
      console.error("❌ Error generating static site:", error);
      process.exit(1);
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new StaticSiteGenerator();
  generator.generate();
}

module.exports = StaticSiteGenerator;
