const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const statusMessage = document.getElementById('status-message');

// --- 1. Event Listeners for Drag & Drop ---
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault(); // Prevent browser from opening the file
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) handleUpload(files);
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) handleUpload(e.target.files);
});

// --- 2. The Upload Function ---
function handleUpload(files) {
  const formData = new FormData();
  
  // Append all selected files to the FormData object
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  // Use XMLHttpRequest to track upload progress natively
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      progressContainer.style.display = 'block';
      progressBar.style.width = percentComplete + '%';
      statusMessage.style.color = 'black';
      statusMessage.textContent = `Uploading... ${percentComplete}%`;
    }
  });

  xhr.addEventListener('load', () => {
    const response = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
      statusMessage.style.color = 'green';
      statusMessage.textContent = response.message;
    } else {
      statusMessage.style.color = 'red';
      statusMessage.textContent = `Error: ${response.message}`;
    }
    // Reset progress bar after 2 seconds
    setTimeout(() => { progressContainer.style.display = 'none'; progressBar.style.width = '0%'; }, 2000);
  });

  xhr.addEventListener('error', () => {
    statusMessage.style.color = 'red';
    statusMessage.textContent = 'Upload failed due to a network error.';
  });

  // Send the request
  xhr.open('POST', '/api/upload', true);
  xhr.send(formData);
}