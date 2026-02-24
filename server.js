// Change this part in your server.js
const storage = multer.memoryStorage(); // Switch from diskStorage to memoryStorage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.post('/api/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }

  // In a real production app on Vercel, you would now send 
  // req.files[0].buffer to AWS S3 or Cloudinary.
  
  res.status(200).json({ 
    success: true, 
    message: "File received in memory! (Note: Vercel does not support permanent local disk storage)" 
  });
});