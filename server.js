require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // It finds the URL in process.env automatically
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'codespace_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf']
  },
});

const upload = multer({ storage: storage });
app.use(express.static('public'));

app.post('/api/upload', upload.array('files', 5), (req, res) => {
  try {
    const fileUrls = req.files.map(file => file.path);
    res.json({ success: true, urls: fileUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));