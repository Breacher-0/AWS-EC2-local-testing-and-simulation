import { useState, useRef } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import './App.css';

const LOCALSTACK_ENDPOINT = 'http://localhost:4566';
const BUCKET_NAME = 'university-docs';
const REGION = 'us-east-1';

const s3 = new S3Client({
  region: REGION,
  endpoint: LOCALSTACK_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setStatusMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setStatusMessage('Uploading to LocalStack S3...');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `uploads/${selectedFile.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: selectedFile.type || 'application/octet-stream',
      });

      await s3.send(command);

      setUploadStatus('success');
      setStatusMessage(`"${selectedFile.name}" uploaded successfully to s3://${BUCKET_NAME}/uploads/`);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
      setStatusMessage(`Upload failed: ${err.message}`);
    }
  };

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Cloud Simulation Demo</h1>
        <p className="subtitle">Software Validation – LocalStack S3 & Lambda</p>
      </header>

      <main className="upload-panel">
        <div className="drop-zone" onClick={triggerFileDialog} role="button" aria-label="Select file to upload">
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
          <div className="drop-zone-content">
            <span className="upload-icon" aria-hidden="true">📄</span>
            {selectedFile ? (
              <p className="file-name">{selectedFile.name}</p>
            ) : (
              <p className="drop-hint">Click to select a file</p>
            )}
          </div>
        </div>

        <button
          id="upload-button"
          className="upload-btn"
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'uploading'}
        >
          {uploadStatus === 'uploading' ? 'Uploading…' : 'Upload to S3'}
        </button>

        {statusMessage && (
          <div
            id="status-message"
            className={`status-bar ${uploadStatus}`}
            role="status"
          >
            {statusMessage}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Endpoint: <code>{LOCALSTACK_ENDPOINT}</code> &middot; Bucket:{' '}
          <code>{BUCKET_NAME}</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
