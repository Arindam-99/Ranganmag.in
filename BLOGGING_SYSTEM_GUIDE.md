# Ranganmag Blogging System - Complete Guide

A comprehensive blogging system with two main components:
1. **Blogger Upload Interface** - Admin panel for uploading PDF articles
2. **Static Article Display Site** - Public-facing website that auto-updates

##  System Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Admin Interface   │    │   Backend API       │    │   Static Site       │
│   (Port 3001)       │───▶│   (Port 5000)       │───▶│   (Port 8082)       │
│                     │    │                     │    │                     │
│ - Upload PDFs       │    │ - Store Articles    │    │ - Display Articles  │
│ - Manage Articles   │    │ - Local Storage     │    │ - PDF Viewing       │
│ - Dashboard         │    │ - Auto Regeneration │    │ - Responsive Design │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   File Storage      │
                           │                     │
                           │ - Local PDFs        │
                           │ - JSON Database     │
                           │ - Firebase Backup   │
                           └─────────────────────┘
```

##  Quick Start

### 1. Start All Services

```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Admin Interface
cd admin
npm run dev

# Terminal 3: Static Site (auto-generated)
cd static-site
npm run build
```

### 2. Access the System

- **Admin Interface**: http://localhost:3001/
- **Backend API**: http://localhost:5000/
- **Static Site**: http://localhost:8082/

## 📝 How to Use

### For Bloggers (Admin Interface)

1. **Access Admin Panel**
   - Open http://localhost:3001/
   - Navigate to "Upload Article"

2. **Upload New Article**
   - Fill in article details (title, author, category)
   - Drag & drop PDF file or click to select
   - Mark as featured if needed
   - Click "Upload Article"

3. **Manage Articles**
   - Go to "Manage Articles" to view all articles
   - Toggle featured status
   - Delete articles if needed
   - View PDF files directly

### For Readers (Static Site)

1. **View Articles**
   - Visit http://localhost:8082/
   - Browse featured and regular articles
   - Click on article titles to read full content

2. **Read PDFs**
   - Each article page shows embedded PDF viewer
   - Download or print PDFs directly
   - Share articles on social media

## 🔄 Automatic Updates

The system automatically updates the static site when:
- New articles are uploaded
- Articles are modified or deleted
- Featured status is changed

**How it works:**
1. Blogger uploads article via admin interface
2. Backend stores PDF locally and saves metadata
3. Backend triggers static site regeneration
4. Static site updates with new content
5. Readers see updated content immediately

## 📁 File Structure

```
Ranganmag.in/
├── admin/                    # Admin interface (React + Vite)
│   ├── src/
│   │   ├── components/      # Header, navigation
│   │   ├── pages/          # Dashboard, Upload, ArticleList
│   │   └── App.jsx
│   └── package.json
├── backend/                 # API server (Node.js + Express)
│   ├── routes/
│   │   └── articles-new.js # Article management API
│   ├── uploads/            # Local PDF storage
│   ├── data/
│   │   └── articles.json   # Article metadata
│   └── server.js
├── static-site/            # Static site generator
│   ├── templates/          # Handlebars templates
│   ├── dist/              # Generated static files
│   ├── generate.js        # Site generator script
│   └── package.json
└── frontend/              # Original React app (optional)
```

## 🛠️ Technical Features

### Backend API Endpoints

- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/upload` - Upload new article with PDF
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /uploads/:filename` - Serve PDF files

### Admin Interface Features

- **Dashboard**: Statistics and recent articles
- **Upload Form**: Drag & drop PDF upload with metadata
- **Article Management**: List, filter, and manage articles
- **Real-time Updates**: Progress bars and notifications
- **Responsive Design**: Works on desktop and mobile

### Static Site Features

- **SEO Optimized**: Meta tags, structured data, social sharing
- **Fast Loading**: Static HTML files, optimized assets
- **PDF Viewing**: Embedded PDF viewer with download options
- **Bengali Support**: Proper Bengali fonts and typography
- **Mobile Friendly**: Responsive design for all devices

## 🔧 Configuration

### Environment Variables (Backend)

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Firebase (optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket
```

### Customization Options

1. **Styling**: Modify CSS in `admin/src/index.css` and `static-site/generate.js`
2. **Templates**: Edit Handlebars templates in `static-site/templates/`
3. **Categories**: Update category lists in admin forms
4. **Branding**: Change site title, logo, and colors

## 🔄 Deployment

### Development
- All services run locally
- Files stored in local directories
- Automatic regeneration enabled

### Production
1. **Backend**: Deploy to cloud service (Heroku, DigitalOcean)
2. **Admin**: Build and deploy to static hosting
3. **Static Site**: Deploy generated files to CDN
4. **Storage**: Configure Firebase for PDF backup

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on specific ports
   npx kill-port 3001 5000 8082
   ```

2. **Static Site Not Updating**
   ```bash
   # Manually regenerate
   cd static-site
   npm run generate
   ```

3. **PDF Upload Fails**
   - Check file size (max 10MB)
   - Ensure uploads directory exists
   - Verify file is PDF format

4. **Admin Interface Not Loading**
   - Check if backend is running
   - Verify CORS settings
   - Check browser console for errors

### Logs and Debugging

- Backend logs: Check terminal running `npm run dev`
- Admin interface: Open browser developer tools
- Static site: Check generation logs in terminal

## 🔮 Future Enhancements

### Planned Features

1. **Firebase Integration**
   - Automatic PDF backup to Firebase Storage
   - Real-time database for article metadata
   - User authentication for admin access

2. **Advanced Features**
   - Article scheduling
   - Comment system
   - Newsletter integration
   - Analytics dashboard

3. **Performance Optimizations**
   - Image optimization
   - CDN integration
   - Caching strategies
   - Progressive Web App features

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request

---

**Ranganmag Blogging System** - Built with ❤️ for modern Bengali journalism
