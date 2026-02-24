const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Success! Your Node app is running.</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is humming along at http://localhost:${PORT}`);
});