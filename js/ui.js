/**
 * UI Module
 * Handles user interface interactions and updates
 */

class UIManager {
    constructor() {
        this.setupResponsiveness();
        this.setupKeyboardShortcuts();
    }

    setupResponsiveness() {
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    handleWindowResize() {
        // Adjust canvas size if needed
        if (labScene && labScene.renderer) {
            labScene.onWindowResize();
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC to go to welcome screen
            if (e.key === 'Escape' && experiment) {
                if (experiment.state !== 'welcome') {
                    experiment.exitExperiment();
                }
            }

            // Enter to submit response (handled in experiment.js)
        });
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                notification.parentNode?.removeChild(notification);
            }, 300);
        }, duration);
    }

    createLoadingOverlay(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.style.display = 'flex';
            return overlay;
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    formatTime(ms) {
        if (ms < 1000) {
            return Math.round(ms) + 'ms';
        }
        return (ms / 1000).toFixed(2) + 's';
    }

    formatPercentage(value) {
        return Math.round(value) + '%';
    }

    createChartCanvas(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const canvas = document.createElement('canvas');
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        container.appendChild(canvas);
        return canvas;
    }

    updateTableRow(tableId, rowIndex, data) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        if (rows[rowIndex]) {
            const cells = rows[rowIndex].querySelectorAll('td');
            Object.keys(data).forEach((key, index) => {
                if (cells[index]) {
                    cells[index].textContent = data[key];
                }
            });
        }
    }
}

// Global UI manager instance
let uiManager = null;

function initializeUI() {
    if (!uiManager) {
        uiManager = new UIManager();
    }
    return uiManager;
}

// Utility Functions

/**
 * Validate numeric input
 */
function validateNumericInput(value, min, max) {
    const num = parseInt(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
}

/**
 * Sanitize user input
 */
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .trim();
}

/**
 * Generate unique ID
 */
function generateUID() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Format data for CSV export
 */
function exportToCSV(data, filename = 'tachistoscope_results.csv') {
    let csv = '';

    // Headers
    const headers = Object.keys(data.trials[0]);
    csv += headers.join(',') + '\n';

    // Rows
    data.trials.forEach(trial => {
        const values = headers.map(header => {
            const value = trial[header];
            // Escape quotes in CSV
            if (typeof value === 'string') {
                return '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Print experiment results
 */
function printResults() {
    const results = experimentData.exportResults();
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
            <head>
                <title>Tachistoscope Experiment Results</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #667eea; }
                    .summary { background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background: #667eea; color: white; }
                </style>
            </head>
            <body>
                <h1>Tachistoscope Experiment Results</h1>
                <div class="summary">
                    <h3>Summary Statistics</h3>
                    <p><strong>Total Trials:</strong> ${results.summary.totalTrials}</p>
                    <p><strong>Overall Accuracy:</strong> ${results.summary.overallAccuracy}%</p>
                    <p><strong>Average Span:</strong> ${results.summary.averageSpan} items</p>
                    <p><strong>Average Reaction Time:</strong> ${results.summary.averageReactionTime}ms</p>
                    <p><strong>Timestamp:</strong> ${new Date(results.timestamp).toLocaleString()}</p>
                </div>

                <h3>Detailed Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Trial</th>
                            <th>Stimulus</th>
                            <th>Response</th>
                            <th>Correct</th>
                            <th>Accuracy</th>
                            <th>Reaction Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.trials.map((trial, i) => `
                            <tr>
                                <td>${trial.trialNumber}</td>
                                <td>${trial.stimulus}</td>
                                <td>${trial.response || '(skipped)'}</td>
                                <td>${trial.isCorrect ? '✓' : '✗'}</td>
                                <td>${trial.accuracy}%</td>
                                <td>${trial.reactionTime}ms</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
            </body>
        </html>
    `);
    printWindow.document.close();
}

/**
 * Add tooltip to element
 */
function addTooltip(element, text) {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltiptext';
    tooltip.textContent = text;

    const container = document.createElement('span');
    container.className = 'tooltip';
    container.style.cursor = 'help';

    element.parentNode?.insertBefore(container, element);
    container.appendChild(element);
    container.appendChild(tooltip);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Request full screen
 */
function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

/**
 * Exit full screen
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
