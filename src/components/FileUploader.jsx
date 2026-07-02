import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import '../styles/FileUploader.css';

function FileUploader({ onFileUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        Papa.parse(text, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results) => {
            const cleanedData = results.data.filter(row => Object.values(row).some(v => v));
            onFileUpload(cleanedData);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Parse error:', error);
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Error processing file:', err);
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-uploader">
      <h3>📁 Upload Patent Data</h3>
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing file...</p>
          </div>
        ) : fileName ? (
          <div className="file-info">
            <p>✓ {fileName}</p>
            <small>Click to change</small>
          </div>
        ) : (
          <div className="upload-prompt">
            <p className="icon">📤</p>
            <p>Drag and drop CSV or Excel file</p>
            <p className="or">or</p>
            <p className="click">Click to select</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      <p className="hint">Supported: CSV, XLSX</p>
    </div>
  );
}

export default FileUploader;
