#!/bin/bash

# Setup script for 3D Psychology Virtual Lab - Tachistoscope Experiment
# This script downloads the required library files

echo "=================================="
echo "Tachistoscope Lab Setup Script"
echo "=================================="
echo ""

# Create lib directory if it doesn't exist
mkdir -p lib

# Download Three.js
echo "Downloading Three.js library..."
if command -v curl &> /dev/null; then
    curl -s "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" -o lib/three.min.js
    THREE_STATUS=$?
elif command -v wget &> /dev/null; then
    wget -q "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" -O lib/three.min.js
    THREE_STATUS=$?
else
    echo "ERROR: Neither curl nor wget found. Please install one of them."
    exit 1
fi

if [ $THREE_STATUS -eq 0 ]; then
    echo "✓ Three.js downloaded successfully"
    THREE_SIZE=$(du -h lib/three.min.js | cut -f1)
    echo "  File size: $THREE_SIZE"
else
    echo "✗ Failed to download Three.js"
    echo "  You can manually download from: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
fi

echo ""

# Download Chart.js
echo "Downloading Chart.js library..."
if command -v curl &> /dev/null; then
    curl -s "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" -o lib/chart.min.js
    CHART_STATUS=$?
elif command -v wget &> /dev/null; then
    wget -q "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" -O lib/chart.min.js
    CHART_STATUS=$?
else
    echo "ERROR: Neither curl nor wget found."
    exit 1
fi

if [ $CHART_STATUS -eq 0 ]; then
    echo "✓ Chart.js downloaded successfully"
    CHART_SIZE=$(du -h lib/chart.min.js | cut -f1)
    echo "  File size: $CHART_SIZE"
else
    echo "✗ Failed to download Chart.js"
    echo "  You can manually download from: https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"
fi

echo ""
echo "=================================="

if [ $THREE_STATUS -eq 0 ] && [ $CHART_STATUS -eq 0 ]; then
    echo "✓ All libraries installed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start a local server:"
    echo "   Python 3:  python -m http.server 8000"
    echo "   Node.js:   npx http-server"
    echo "   PHP:       php -S localhost:8000"
    echo ""
    echo "2. Open your browser and navigate to:"
    echo "   http://localhost:8000"
    echo ""
else
    echo "✗ Some libraries failed to download"
    echo ""
    echo "Please download manually:"
    echo "1. Three.js: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    echo "2. Chart.js: https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"
    echo ""
    echo "Save them to the 'lib' directory and run:"
    echo "   python -m http.server 8000"
fi

echo "=================================="
