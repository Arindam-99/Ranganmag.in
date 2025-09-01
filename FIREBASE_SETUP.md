# Firebase Setup Guide for Ranganmag

This guide will help you set up Firebase for PDF storage and file management in the Ranganmag newspaper website.

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ranganmag` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firebase Storage

1. In your Firebase project console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for now (you can configure security rules later)
4. Select a storage location (choose the closest to your users)
5. Click "Done"

### Step 3: Create Service Account

1. Go to Project Settings (gear icon) → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - it contains sensitive credentials

## 🔧 Backend Configuration

### Step 1: Environment Variables

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in the values from your Firebase service account JSON:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration (from your service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Step 2: Enable Upload Route

1. Open `backend/server.js`
2. Uncomment the upload route:
   ```javascript
   app.use('/api/upload', require('./routes/upload'));
   ```

### Step 3: Test Firebase Connection

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📁 File Upload Testing

### Using Postman or curl

```bash
# Upload a PDF file
curl -X POST \
  http://localhost:5000/api/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/file.pdf'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "fileName": "1640995200000-sample.pdf",
    "originalName": "sample.pdf",
    "url": "https://storage.googleapis.com/your-bucket/1640995200000-sample.pdf",
    "size": 1024000,
    "type": "application/pdf"
  },
  "message": "File uploaded successfully"
}
```

## 🔒 Security Rules (Production)

For production, update your Firebase Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /{allPaths=**} {
      allow write: if request.auth != null
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && (request.resource.contentType.matches('application/pdf') 
            || request.resource.contentType.matches('image/.*'));
    }
  }
}
```

## 🚀 Frontend Integration

The frontend is already configured to work with the upload API. Once Firebase is set up:

1. Users can upload PDF files through the admin interface
2. PDFs are stored in Firebase Storage
3. Public URLs are generated for viewing
4. Files can be embedded in articles

## 🛠️ Troubleshooting

### Common Issues

1. **"Service account object must contain a string 'project_id' property"**
   - Check that all Firebase environment variables are set correctly
   - Ensure the private key is properly formatted with `\n` for line breaks

2. **CORS errors**
   - Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - Check that the frontend is running on the correct port

3. **File upload fails**
   - Verify Firebase Storage is enabled
   - Check storage bucket name in environment variables
   - Ensure service account has Storage Admin permissions

### Debug Steps

1. Check server logs for detailed error messages
2. Verify Firebase project settings
3. Test with a small PDF file first
4. Check network connectivity to Firebase

## 📝 Next Steps

After Firebase is configured:

1. Test PDF upload functionality
2. Implement PDF viewer in the frontend
3. Add file management features
4. Set up proper authentication for admin users
5. Configure production security rules

---

For more help, refer to the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in the project repository.
