import React from 'react';
import '../styles/ValidationMetrics.css';

function ValidationMetrics({ results }) {
  if (!results || !results.metrics) return <div>No metrics available</div>;

  const metrics = results.metrics;

  const getMetricColor = (value, isHighBetter = true) => {
    if (isHighBetter) {
      return value > 0.6 ? 'good' : value > 0.4 ? 'warning' : 'poor';
    } else {
      return value < 0.5 ? 'good' : value < 1.5 ? 'warning' : 'poor';
    }
  };

  return (
    <div className="validation-metrics">
      <h3>📊 Validation Metrics</h3>

      <div className="metrics-grid">
        <div className={`metric-card ${getMetricColor(metrics.silhouetteScore)}`}>
          <h4>Silhouette Score</h4>
          <p className="value">{metrics.silhouetteScore.toFixed(3)}</p>
          <p className="description">Measures cluster cohesion and separation (-1 to 1)</p>
          <p className="interpretation">
            {metrics.silhouetteScore > 0.5 ? '✓ Excellent clustering' : 
             metrics.silhouetteScore > 0.3 ? '△ Reasonable clustering' : 
             '✗ Poor cluster separation'}
          </p>
        </div>

        <div className={`metric-card ${getMetricColor(metrics.daviesBouldinIndex, false)}`}>
          <h4>Davies-Bouldin Index</h4>
          <p className="value">{metrics.daviesBouldinIndex.toFixed(3)}</p>
          <p className="description">Avg ratio of within to between cluster distances (lower is better)</p>
          <p className="interpretation">
            {metrics.daviesBouldinIndex < 0.5 ? '✓ Excellent separation' :
             metrics.daviesBouldinIndex < 1.5 ? '△ Good separation' :
             '✗ Poor separation'}
          </p>
        </div>

        <div className={`metric-card ${getMetricColor(1 - metrics.wcssRatio)}`}>
          <h4>WCSS Ratio</h4>
          <p className="value">{(metrics.wcssRatio * 100).toFixed(1)}%</p>
          <p className="description">Within-cluster scatter / Total variance</p>
          <p className="interpretation">
            {metrics.wcssRatio < 0.3 ? '✓ Tight clusters' :
             metrics.wcssRatio < 0.6 ? '△ Moderate tightness' :
             '✗ Loose clusters'}
          </p>
        </div>

        <div className="metric-card info">
          <h4>Total WCSS</h4>
          <p className="value">{metrics.wcss.toFixed(2)}</p>
          <p className="description">Sum of within-cluster variance (lower is better)</p>
        </div>

        <div className={`metric-card ${metrics.noisePercentage > 20 ? 'warning' : 'good'}`}>
          <h4>Noise %</h4>
          <p className="value">{metrics.noisePercentage.toFixed(1)}%</p>
          <p className="description">Patents not assigned to any cluster</p>
          <p className="interpretation">
            {metrics.noisePercentage < 5 ? '✓ Low noise' :
             metrics.noisePercentage < 15 ? '△ Moderate noise' :
             '⚠ High noise - consider adjusting parameters'}
          </p>
        </div>

        <div className="metric-card info">
          <h4>Clusters Found</h4>
          <p className="value">{results.numClusters}</p>
          <p className="description">Number of clusters identified</p>
        </div>
      </div>

      <div className="metrics-summary">
        <h4>Summary</h4>
        <ul>
          <li><strong>Total Patents:</strong> {results.patents.length}</li>
          <li><strong>Clustered Patents:</strong> {results.patents.length - Math.round(metrics.noisePercentage * results.patents.length / 100)}</li>
          <li><strong>Noise Points:</strong> {Math.round(metrics.noisePercentage * results.patents.length / 100)}</li>
          <li><strong>Average Cluster Size:</strong> {(results.patents.length / (results.numClusters + 1)).toFixed(0)}</li>
        </ul>
      </div>
    </div>
  );
}

export default ValidationMetrics;
