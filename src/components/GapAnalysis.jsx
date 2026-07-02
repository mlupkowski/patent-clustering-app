import React, { useState, useEffect } from 'react';
import { performGapAnalysis } from '../services/voronoiGaps';
import '../styles/GapAnalysis.css';

function GapAnalysis({ results, onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    handleAnalysis();
  }, []);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    try {
      setProgress(33);
      const gaps = await performGapAnalysis(results, (prog) => setProgress(prog));
      setProgress(100);
      onAnalysisComplete(gaps);
    } catch (error) {
      console.error('Gap analysis error:', error);
      alert('Error during gap analysis: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="gap-analysis">
      <h3>🔍 Whitespace Analysis</h3>
      {isAnalyzing ? (
        <div className="analyzing">
          <div className="progress-bar" style={{ width: progress + '%' }}></div>
          <p>Analyzing gaps between clusters... {progress}%</p>
        </div>
      ) : (
        <button onClick={handleAnalysis} className="analyze-btn">
          🚀 Perform Gap Analysis
        </button>
      )}
    </div>
  );
}

export default GapAnalysis;
