import React, { useState } from 'react';
import { performClustering } from '../services/clusteringEngine';
import '../styles/ClusteringEngine.css';

function ClusteringEngine({ data, onClusteringComplete, onStepChange }) {
  const [minClusterSize, setMinClusterSize] = useState(5);
  const [minSamples, setMinSamples] = useState(5);
  const [isClustering, setIsClustering] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    title: true,
    abstract: true,
    ipcCode: false,
    filingYear: false
  });

  const availableColumns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleColumnToggle = (col) => {
    setSelectedColumns(prev => ({
      ...prev,
      [col]: !prev[col]
    }));
  };

  const handleClustering = async () => {
    setIsClustering(true);
    try {
      const columns = Object.keys(selectedColumns).filter(c => selectedColumns[c]);
      const results = await performClustering(
        data,
        {
          minClusterSize: parseInt(minClusterSize),
          minSamples: parseInt(minSamples),
          columns
        },
        onStepChange
      );
      onClusteringComplete(results);
    } catch (error) {
      console.error('Clustering error:', error);
      alert('Error during clustering: ' + error.message);
    } finally {
      setIsClustering(false);
    }
  };

  return (
    <div className="clustering-engine">
      <h3>⚙️ Clustering Configuration</h3>

      <div className="config-section">
        <label>
          <span>Min Cluster Size</span>
          <input
            type="number"
            value={minClusterSize}
            onChange={(e) => setMinClusterSize(e.target.value)}
            min="2"
            max="100"
            disabled={isClustering}
          />
        </label>
        <small>Minimum points to form a cluster (default: 5)</small>
      </div>

      <div className="config-section">
        <label>
          <span>Min Samples</span>
          <input
            type="number"
            value={minSamples}
            onChange={(e) => setMinSamples(e.target.value)}
            min="1"
            max="100"
            disabled={isClustering}
          />
        </label>
        <small>Samples for cluster density (default: 5)</small>
      </div>

      <div className="config-section">
        <label>Features to Use:</label>
        <div className="column-checkboxes">
          {availableColumns.map(col => (
            <label key={col} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedColumns[col] || false}
                onChange={() => handleColumnToggle(col)}
                disabled={isClustering}
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="cluster-btn"
        onClick={handleClustering}
        disabled={isClustering}
      >
        {isClustering ? '⏳ Clustering...' : '🚀 Start Clustering'}
      </button>
    </div>
  );
}

export default ClusteringEngine;
