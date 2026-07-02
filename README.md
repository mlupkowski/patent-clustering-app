# Patent Clustering & Whitespace Analysis

A complete client-side web application for clustering patent records using HDBSCAN and identifying innovation gaps using Voronoi diagram analysis.

## Features

✨ **Complete Client-Side Processing**
- No backend server required
- All data processing happens in the browser
- User data stays private

🔬 **HDBSCAN Clustering**
- Density-based clustering algorithm
- Automatic noise detection
- Handles varying cluster sizes

📊 **Comprehensive Validation Metrics**
- Silhouette Score (cluster cohesion and separation)
- Davies-Bouldin Index (within-cluster to between-cluster ratio)
- WCSS (Within-Cluster Sum of Squares)
- Noise Percentage
- Intra-cluster scatter to inter-cluster separation ratio

⚡ **Voronoi Gap Detection**
- Identifies whitespace between clusters
- Discovers innovation opportunities
- Analyzes market intensity and growth trends

📁 **File Upload Support**
- CSV format
- Excel format (XLSX)
- Configurable column selection

📥 **Export Capabilities**
- Export clusters as CSV
- Export gaps and opportunities as CSV
- Full analysis results as JSON

## Installation

```bash
# Clone the repository
git clone https://github.com/mlupkowski/patent-clustering-app.git
cd patent-clustering-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

## Usage

### 1. Prepare Your Data
Create a CSV or Excel file with patent records. Required columns:
- `title` - Patent title
- `abstract` - Patent abstract/description

Optional columns:
- `ipcCode` - IPC classification
- `filingYear` - Year of filing
- `applicant` - Patent applicant
- Any other relevant fields

### 2. Upload File
Click the upload area or drag-and-drop your file

### 3. Configure Clustering
- **Min Cluster Size**: Minimum patents in a cluster (default: 5)
- **Min Samples**: Samples for density estimation (default: 5)
- **Features**: Select which columns to use for clustering

### 4. Run Analysis
Click "Start Clustering" to begin processing:
1. Data parsing and validation
2. Text vectorization (TF-IDF)
3. Dimensionality reduction (UMAP simulation)
4. HDBSCAN clustering
5. Metric calculation

### 5. Review Results
- **Cluster Visualization**: 2D scatter plot with clusters and centroids
- **Validation Metrics**: Quality assessment of clusters
- **Cluster Summary**: Number of patents per cluster

### 6. Analyze Gaps
Click "Perform Gap Analysis" to:
- Identify whitespace regions
- Calculate Voronoi diagrams
- Find innovation opportunities
- Analyze market intensity

### 7. Export Results
Download:
- Cluster assignments (CSV)
- Gap opportunities (CSV)
- Full analysis report (JSON)

## Understanding the Metrics

### Silhouette Score (-1 to 1)
- **> 0.5**: Excellent clustering quality
- **0.3-0.5**: Reasonable clustering
- **< 0.3**: Poor cluster separation

### Davies-Bouldin Index (lower is better)
- **< 0.5**: Excellent cluster separation
- **0.5-1.5**: Good separation
- **> 1.5**: Poor separation

### WCSS Ratio (lower is better)
- **< 0.3**: Tight, well-defined clusters
- **0.3-0.6**: Moderate cluster tightness
- **> 0.6**: Loose clusters

### Noise Percentage
- **< 5%**: Low noise (good)
- **5-15%**: Moderate noise
- **> 15%**: High noise (consider parameter adjustment)

## Gap Analysis

Whitespace analysis identifies regions in the feature space with few or no patents, representing potential innovation areas.

**For each gap:**
- **Gap Size**: Distance between adjacent clusters
- **Market Intensity**: Number of nearby patents
- **Growth Trend**: % of recent patents in the gap region
- **Related Technologies**: Key terms from nearby patents
- **Status**: High activity vs. emerging opportunity

## Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Visualization**: Plotly.js
- **Data Processing**: Custom implementations + D3
- **Text Processing**: TF-IDF vectorization
- **Clustering**: HDBSCAN implementation
- **Geometry**: Voronoi diagrams

## File Structure

```
patent-clustering-app/
├── src/
│   ├── components/           # React components
│   ├── services/             # Core algorithms
│   ├── styles/               # CSS files
│   ├── App.jsx               # Main app component
│   └── index.jsx             # Entry point
├── public/                   # Static files
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Notes

- **Optimal**: 500-5,000 patents
- **Good**: 5,000-20,000 patents
- **Challenging**: 20,000+ patents (may require parameter tuning)

Performance depends on:
- Text length (abstracts)
- Number of features selected
- Browser available memory

## Troubleshooting

### High Noise Percentage
- Increase `minClusterSize` to 3-4
- Increase `minSamples` to 3-5
- Check if text data is sufficient

### Poor Silhouette Score
- Try different feature combinations
- Consider filtering very short abstracts
- Check data quality

### Browser Crashes
- Reduce dataset size
- Try a different browser
- Clear browser cache

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## Sample Data

You can test with sample patent data. The application expects CSV format with columns:
```
title,abstract,ipcCode,filingYear
"Method for AI","A method for artificial intelligence...","G06F",2022
...
```

## Future Enhancements

- [ ] Additional clustering algorithms (K-Means, DBSCAN)
- [ ] Support for more file formats (JSON, Parquet)
- [ ] Custom metric calculations
- [ ] Advanced visualization options
- [ ] Patent API integration
- [ ] Collaborative features

## Support

For issues and questions, please open a GitHub issue.
