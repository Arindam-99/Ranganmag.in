# Ranganmag - Modern Bengali Newspaper Website

A modern, responsive newspaper website built with React.js, Node.js, and Firebase. Features a clean, newspaper-style design with Bengali language support.

## 🚀 Features

- **Modern Design**: Clean, newspaper-style layout inspired by traditional Bengali newspapers
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Bengali Support**: Full Bengali language support with proper fonts
- **Article Management**: Create, read, and manage articles
- **PDF Storage**: Firebase integration for PDF storage and viewing
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Bootstrap** - Responsive CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - For file storage and management
- **Multer** - File upload middleware

### Storage
- **Firebase Storage** - For PDF and image storage

## 📁 Project Structure

```
Ranganmag.in/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── config/             # Configuration files
│   ├── server.js           # Main server file
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ranganmag.in
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firebase Storage
   - Generate a service account key
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your Firebase configuration

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

### Individual Commands

- **Frontend only**: `npm run client`
- **Backend only**: `npm run server`
- **Build frontend**: `npm run build`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full layout with sidebar
- **Tablet**: Adapted layout with collapsible navigation
- **Mobile**: Mobile-first design with touch-friendly interface

## 🎨 Design Features

- **Bengali Typography**: Proper Bengali font support
- **Newspaper Layout**: Traditional newspaper-style design
- **Color Scheme**: Red and white theme matching Bengali newspaper aesthetics
- **Interactive Elements**: Hover effects and smooth transitions
- **Print Friendly**: Optimized for printing articles

## 📄 API Endpoints

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create new article

### File Upload
- `POST /api/upload` - Upload PDF or image files
- `DELETE /api/upload/:fileName` - Delete uploaded file

### Health Check
- `GET /api/health` - Server health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by traditional Bengali newspapers
- Built with modern web technologies
- Designed for the Bengali-speaking community

---

**Ranganmag** - রাঙ্গামাগ - আধুনিক বাংলা সংবাদপত্র
