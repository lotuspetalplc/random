const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Serve the frontend UI
app.use(express.static('public'));

// 2. Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 3. Configure Storage (Production-style naming)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Generate a random, collision-free filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 4. Validation & Limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per file
  fileFilter: (req, file, cb) => {
    // Only allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
  }
});

// 5. The API Endpoint
app.post('/api/upload', (req, res) => {
  // 'files' is the field name, max 10 files at once
  upload.array('files', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // An unknown error occurred (e.g., wrong file type)
      return res.status(400).json({ success: false, message: err.message });
    }
    
    // Success!
    res.status(200).json({ 
      success: true, 
      message: `${req.files.length} file(s) uploaded successfully!`,
      files: req.files.map(f => f.filename) // Return saved filenames
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));