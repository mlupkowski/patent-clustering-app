import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { generateVoronoiDiagram } from '../services/voronoiGaps';
import '../styles/ClusterVisualization.css';

function ClusterVisualization({ results, gaps, onGapSelect }) {
  const [voronoiData, setVoronoiData] = useState(null);
  const [showVoronoi, setShowVoronoi] = useState(true);

  useEffect(() => {
    if (results && results.reducedEmbeddings) {
      const voronoi = generateVoronoiDiagram(
        results.reducedEmbeddings,
        results.labels,
        results.centroids
      );
      setVoronoiData(voronoi);
    }
  }, [results]);

  if (!results) return <div>No results to display</div>;

  const clusterColorMap = generateColorMap(results.numClusters);
  const colors = results.labels.map(label => clusterColorMap[label]);

  const scatterTrace = {
    x: results.reducedEmbeddings.map(p => p[0]),
    y: results.reducedEmbeddings.map(p => p[1]),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 6,
      color: colors,
      opacity: 0.7,
      line: {
        width: 1,
        color: 'white'
      }
    },
    text: results.patents.map((p, idx) => `${p.title || 'Patent ' + idx}<br>Cluster: ${results.labels[idx]}`),
    hovertemplate: '%{text}<extra></extra>',
    name: 'Patents'
  };

  const centroidTrace = {
    x: results.centroids.map(c => c[0]),
    y: results.centroids.map(c => c[1]),
    mode: 'markers+text',
    type: 'scatter',
    marker: {
      size: 15,
      color: Object.keys(clusterColorMap).map(k => clusterColorMap[k]),
      symbol: 'star',
      line: { width: 2, color: 'white' }
    },
    text: Object.keys(clusterColorMap).map(k => `C${k}`),
    textposition: 'bottom center',
    hovertemplate: 'Cluster %{text}<extra></extra>',
    name: 'Centroids'
  };

  const traces = [scatterTrace, centroidTrace];

  // Add Voronoi edges if enabled
  if (showVoronoi && voronoiData && voronoiData.edges) {
    voronoiData.edges.forEach(edge => {
      traces.push({
        x: [edge.x0, edge.x1],
        y: [edge.y0, edge.y1],
        mode: 'lines',
        type: 'scatter',
        line: { color: 'rgba(100, 100, 100, 0.3)', width: 1 },
        hoverinfo: 'none',
        showlegend: false,
        name: 'Voronoi'
      });
    });
  }

  // Add gap annotations
  if (gaps) {
    gaps.forEach((gap, idx) => {
      traces.push({
        x: [gap.midpoint.x],
        y: [gap.midpoint.y],
        mode: 'markers+text',
        type: 'scatter',
        marker: { size: 12, color: 'red', symbol: 'diamond' },
        text: '⚡',
        textposition: 'middle center',
        hovertemplate: gap.opportunity + '<extra></extra>',
        showlegend: false,
        name: `Gap ${idx}`
      });
    });
  }

  const layout = {
    title: 'Patent Clusters Visualization (UMAP + HDBSCAN)',
    xaxis: { title: 'UMAP Dimension 1' },
    yaxis: { title: 'UMAP Dimension 2' },
    height: 600,
    hovermode: 'closest',
    template: 'plotly_white'
  };

  return (
    <div className="cluster-visualization">
      <div className="viz-controls">
        <label>
          <input
            type="checkbox"
            checked={showVoronoi}
            onChange={(e) => setShowVoronoi(e.target.checked)}
          />
          Show Voronoi Diagram
        </label>
      </div>
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
}

function generateColorMap(numClusters) {
  const colors = {};
  const hues = [];
  for (let i = 0; i < numClusters; i++) {
    hues.push(Math.floor((i * 360) / numClusters));
  }
  hues.forEach((hue, idx) => {
    colors[idx] = `hsl(${hue}, 70%, 50%)`;
  });
  colors[-1] = 'rgba(200, 200, 200, 0.5)';
  return colors;
}

export default ClusterVisualization;
