import React, { useState, useRef } from 'react';
import FileUploader from './components/FileUploader';
import ClusteringEngine from './components/ClusteringEngine';
import ClusterVisualization from './components/ClusterVisualization';
import ValidationMetrics from './components/ValidationMetrics';
import GapAnalysis from './components/GapAnalysis';
import './styles/App.css';

function App() {
  const [patentData, setPatentData] = useState(null);
  const [clusterResults, setClusterResults] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [selectedGap, setSelectedGap] = useState(null);
  const [processingStep, setProcessingStep] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (data) => {
    try {
      setPatentData(data);
      setClusterResults(null);
      setGaps(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClusteringComplete = (results) => {
    setClusterResults(results);
    setProcessingStep(null);
  };

  const handleGapAnalysisComplete = (gapResults) => {
    setGaps(gapResults);
  };

  const handleReset = () => {
    setPatentData(null);
    setClusterResults(null);
    setGaps(null);
    setSelectedGap(null);
    setProcessingStep(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔬 Patent Data Clustering & Whitespace Analysis</h1>
        <p>Identify clusters using HDBSCAN and discover innovation gaps with Voronoi analysis</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>❌ Error: {error}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="container">
        <aside className="sidebar">
          <FileUploader onFileUpload={handleFileUpload} />
          
          {patentData && (
            <div className="data-summary">
              <h3>📊 Data Summary</h3>
              <p><strong>Patents Loaded:</strong> {patentData.length}</p>
              <p><strong>Columns:</strong> {patentData.length > 0 ? Object.keys(patentData[0]).length : 0}</p>
              {patentData.length > 0 && (
                <div className="column-list">
                  <strong>Available Columns:</strong>
                  <ul>
                    {Object.keys(patentData[0]).map(col => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {patentData && !clusterResults && (
            <ClusteringEngine 
              data={patentData}
              onClusteringComplete={handleClusteringComplete}
              onStepChange={setProcessingStep}
            />
          )}
        </aside>

        <main className="main-content">
          {processingStep !== null && (
            <div className="progress-bar">
              <div className="step-progress">
                {['Parsing', 'Vectorizing', 'Clustering', 'Analyzing'].map((step, idx) => (
                  <div 
                    key={step} 
                    className={`step ${processingStep >= idx ? 'active' : ''} ${processingStep === idx ? 'current' : ''}`}
                  >
                    <div className="step-dot"></div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="step-label">Processing: {['Parsing Data', 'Vectorizing Text', 'Clustering Patents', 'Analyzing Gaps'][processingStep]}</p>
            </div>
          )}

          {clusterResults && (
            <div className="results-container">
              <div className="results-grid">
                <div className="visualization-panel">
                  <ClusterVisualization 
                    results={clusterResults}
                    gaps={gaps}
                    onGapSelect={setSelectedGap}
                  />
                </div>
                
                <div className="metrics-panel">
                  <ValidationMetrics results={clusterResults} />
                </div>
              </div>

              <div className="gap-analysis-panel">
                {!gaps && (
                  <GapAnalysis
                    results={clusterResults}
                    onAnalysisComplete={handleGapAnalysisComplete}
                  />
                )}
                {gaps && (
                  <div className="gaps-display">
                    <h3>🔍 Whitespace Analysis Results</h3>
                    <div className="gaps-list">
                      {gaps.map((gap, idx) => (
                        <div
                          key={idx}
                          className={`gap-card ${selectedGap?.idx === idx ? 'selected' : ''}`}
                          onClick={() => setSelectedGap({ ...gap, idx })}
                        >
                          <h4>⚡ {gap.opportunity}</h4>
                          <p className="gap-size">Gap Size: {gap.gapSize.toFixed(3)}</p>
                          <p className="clusters">Between: {gap.cluster1Name} ↔ {gap.cluster2Name}</p>
                          {selectedGap?.idx === idx && (
                            <div className="gap-details">
                              <p><strong>Distance:</strong> {gap.distance.toFixed(3)}</p>
                              <p><strong>Market Intensity:</strong> {gap.nearbyPatents} patents</p>
                              <p><strong>Growth Trend:</strong> {(gap.growthTrend * 100).toFixed(1)}%</p>
                              <p><strong>Status:</strong> {gap.marketIndicators?.recentActivity ? '📈 High Activity' : '📊 Emerging'}</p>
                              {gap.surroundingKeywords && (
                                <div className="keywords">
                                  <strong>Related Tech:</strong>
                                  <div className="tags">
                                    {gap.surroundingKeywords.map(kw => (
                                      <span key={kw} className="tag">{kw}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="export-panel">
                <ExportResults results={clusterResults} gaps={gaps} />
              </div>

              <button className="reset-btn" onClick={handleReset}>← Start Over</button>
            </div>
          )}

          {!patentData && (
            <div className="welcome-message">
              <h2>👋 Welcome to Patent Clustering Analysis</h2>
              <p>Upload a CSV or Excel file containing patent records to begin.</p>
              <div className="instructions">
                <h3>How it works:</h3>
                <ol>
                  <li>Upload your patent data (CSV/Excel format)</li>
                  <li>Configure HDBSCAN clustering parameters</li>
                  <li>View cluster visualization and validation metrics</li>
                  <li>Analyze whitespace gaps between clusters</li>
                  <li>Export results for further analysis</li>
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ExportResults({ results, gaps }) {
  const handleExportClusters = () => {
    const csv = convertToCSV(results.patents);
    downloadFile(csv, 'patent_clusters.csv', 'text/csv');
  };

  const handleExportGaps = () => {
    if (!gaps) return;
    const csv = convertGapsToCSV(gaps);
    downloadFile(csv, 'whitespace_gaps.csv', 'text/csv');
  };

  const handleExportJSON = () => {
    const data = { results, gaps };
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'analysis_results.json', 'application/json');
  };

  return (
    <div className="export-controls">
      <h3>📥 Export Results</h3>
      <div className="button-group">
        <button onClick={handleExportClusters}>Download Clusters (CSV)</button>
        {gaps && <button onClick={handleExportGaps}>Download Gaps (CSV)</button>}
        <button onClick={handleExportJSON}>Download Full Report (JSON)</button>
      </div>
    </div>
  );
}

function convertToCSV(patents) {
  if (!patents || patents.length === 0) return '';
  const headers = Object.keys(patents[0]).filter(k => k !== 'embedding');
  const rows = patents.map(p => headers.map(h => {
    const val = p[h];
    if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function convertGapsToCSV(gaps) {
  const headers = ['Opportunity', 'Gap Size', 'Distance', 'Cluster 1', 'Cluster 2', 'Market Intensity', 'Growth Trend', 'Status'];
  const rows = gaps.map(g => [
    g.opportunity,
    g.gapSize.toFixed(3),
    g.distance.toFixed(3),
    g.cluster1Name,
    g.cluster2Name,
    g.nearbyPatents,
    (g.growthTrend * 100).toFixed(1) + '%',
    g.marketIndicators?.recentActivity ? 'High Activity' : 'Emerging'
  ].map(v => {
    if (typeof v === 'string' && v.includes(',')) {
      return `"${v}"`;
    }
    return v;
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default App;
