/**
 * Advanced Export System
 * PDF, Excel, CSV, JSON, and more
 */

class ExportManager {
    constructor() {
        this.results = null;
    }

    setResults(results) {
        this.results = results;
    }

    notify(message, type = 'warning') {
        if (typeof uiManager !== 'undefined' && uiManager?.showNotification) {
            uiManager.showNotification(message, type);
            return;
        }

        console.warn(message);
    }

    getReportContext() {
        const participant = this.results?.participant || {};

        return {
            studentName: participant.name || document.getElementById('student-name')?.value || 'Unknown',
            studentId: participant.id || document.getElementById('student-id')?.value || 'N/A',
            institution: participant.institution || document.getElementById('institution-name')?.value || 'Independent',
            cohort: participant.cohort || document.getElementById('cohort-name')?.value || 'General',
            contactEmail: participant.email || document.getElementById('contact-email')?.value || 'N/A'
        };
    }

    // ===== EXCEL EXPORT =====
    async exportToExcel(filename = 'tachistoscope_results.xlsx') {
        if (!this.results) return;
        if (typeof XLSX === 'undefined') {
            this.notify('Excel export is unavailable because the SheetJS library is not bundled in this build.');
            return;
        }

        const context = this.getReportContext();
        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const summaryData = [
            ['Tachistoscope Pro Report', ''],
            ['Date & Time', new Date().toLocaleString()],
            ['Participant Name', context.studentName],
            ['Participant ID', context.studentId],
            ['Institution / Brand', context.institution],
            ['Cohort / Batch', context.cohort],
            ['Contact Email', context.contactEmail],
            ['', ''],
            ['SUMMARY STATISTICS', ''],
            ['Total Trials', this.results.summary.totalTrials],
            ['Overall Accuracy', this.results.summary.overallAccuracy + '%'],
            ['Average Span', this.results.summary.averageSpan],
            ['Best Span Estimate', this.results.summary.bestSpanEstimate],
            ['Average Reaction Time', this.results.summary.averageReactionTime + 'ms'],
            ['Average Order Accuracy', this.results.summary.averageOrderAccuracy + '%'],
            ['Learning Gain', this.results.summary.learningGain + '%'],
            ['', ''],
            ['CONFIGURATION', ''],
            ['Exposure Time', this.results.config.exposureTime + 's'],
            ['Stimulus Type', this.results.config.stimulusType],
            ['Experiment Mode', this.results.config.experimentMode],
        ];

        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Trial Details Sheet
        const trialHeaders = ['Trial', 'Stimulus', 'Response', 'Accuracy %', 'Order Match %', 'Completeness %', 'Reaction Time (ms)', 'Status'];
        const trialData = this.results.trials.map(trial => [
            trial.trialNumber,
            trial.stimulus,
            trial.response || '(skipped)',
            trial.accuracy,
            trial.orderAccuracy || 0,
            trial.completenessScore || 0,
            trial.reactionTime,
            trial.isCorrect ? 'Correct' : 'Incorrect'
        ]);

        const trialsWs = XLSX.utils.aoa_to_sheet([trialHeaders, ...trialData]);
        trialsWs['!cols'] = [
            { wch: 8 },
            { wch: 20 },
            { wch: 20 },
            { wch: 12 },
            { wch: 14 },
            { wch: 14 },
            { wch: 16 },
            { wch: 12 }
        ];
        XLSX.utils.book_append_sheet(wb, trialsWs, 'Trial Details');

        // Statistics Sheet
        const stats = this.calculateStatistics();
        const statsData = [
            ['PERFORMANCE STATISTICS', ''],
            ['Metric', 'Value'],
            ['Minimum Accuracy', Math.min(...this.results.trials.map(t => t.accuracy || 0)) + '%'],
            ['Maximum Accuracy', Math.max(...this.results.trials.map(t => t.accuracy || 0)) + '%'],
            ['Median Accuracy', this.getMedian(this.results.trials.map(t => t.accuracy || 0)) + '%'],
            ['Standard Deviation', (Math.sqrt(this.getVariance(this.results.trials.map(t => t.accuracy || 0)))).toFixed(2)],
            ['Minimum RT', Math.min(...this.results.trials.map(t => t.reactionTime || 0)) + 'ms'],
            ['Maximum RT', Math.max(...this.results.trials.map(t => t.reactionTime || 0)) + 'ms'],
            ['Correct Responses', this.results.trials.filter(t => t.isCorrect).length],
            ['Incorrect Responses', this.results.trials.filter(t => !t.isCorrect).length],
        ];

        const statsWs = XLSX.utils.aoa_to_sheet(statsData);
        statsWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, statsWs, 'Statistics');

        // Write file
        XLSX.writeFile(wb, filename);
    }

    // ===== PDF EXPORT =====
    async exportToPDF(filename = 'tachistoscope_results.pdf') {
        if (!this.results) return;
        if (typeof html2pdf === 'undefined') {
            this.notify('PDF export is unavailable because the html2pdf library is not bundled in this build.');
            return;
        }

        const element = this.generatePDFContent();
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        await html2pdf().set(opt).from(element).save();
    }

    generatePDFContent() {
        const html = document.createElement('div');
        html.style.padding = '20px';
        html.style.fontFamily = 'Arial, sans-serif';
        html.style.color = '#333';
        html.style.backgroundColor = 'white';

        const context = this.getReportContext();
        const currentDate = new Date().toLocaleString();

        html.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0;">Tachistoscope Pro</h1>
            <h2 style="color: #0f9788; margin: 10px 0;">Span of Attention Session Report</h2>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Participant Information</h3>
            <p><strong>Name:</strong> ${context.studentName}</p>
            <p><strong>ID:</strong> ${context.studentId}</p>
            <p><strong>Institution / Brand:</strong> ${context.institution}</p>
            <p><strong>Cohort / Batch:</strong> ${context.cohort}</p>
            <p><strong>Contact Email:</strong> ${context.contactEmail}</p>
            <p><strong>Date & Time:</strong> ${currentDate}</p>
            <p><strong>Experiment Mode:</strong> ${this.results.config.experimentMode === 'adaptive' ? 'Adaptive' : 'Standard'}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Experiment Parameters</h3>
            <p><strong>Exposure Time:</strong> ${this.results.config.exposureTime}s</p>
            <p><strong>Total Trials:</strong> ${this.results.summary.totalTrials}</p>
            <p><strong>Stimulus Type:</strong> ${this.results.config.stimulusType}</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Results Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f0f0f0;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Metric</td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Value</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Overall Accuracy</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.overallAccuracy}%</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Average Span</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.averageSpan} items</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Best Span Estimate</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.bestSpanEstimate} items</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Average Reaction Time</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.averageReactionTime}ms</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Order Match Accuracy</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.averageOrderAccuracy}%</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd;">Learning Gain</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${this.results.summary.learningGain}%</td>
                </tr>
            </table>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Conclusion</h3>
            <p>${this.generateConclusion()}</p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>This report was generated by Tachistoscope Pro.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        `;

        return html;
    }

    // ===== CSV EXPORT =====
    exportToCSV(filename = 'tachistoscope_results.csv') {
        if (!this.results) return;

        const headers = ['Trial', 'Stimulus', 'Response', 'Accuracy %', 'Order Match %', 'Completeness %', 'Reaction Time (ms)', 'Status'];
        const rows = this.results.trials.map(trial => [
            trial.trialNumber,
            `"${trial.stimulus}"`,
            `"${trial.response || '(skipped)'}"`,
            trial.accuracy,
            trial.orderAccuracy || 0,
            trial.completenessScore || 0,
            trial.reactionTime,
            trial.isCorrect ? 'Correct' : 'Incorrect'
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, filename);
    }

    // ===== JSON EXPORT =====
    exportToJSON(filename = 'tachistoscope_results.json') {
        if (!this.results) return;

        const context = this.getReportContext();
        const data = {
            metadata: {
                studentName: context.studentName,
                studentId: context.studentId,
                institution: context.institution,
                cohort: context.cohort,
                contactEmail: context.contactEmail,
                exportDate: new Date().toISOString(),
                version: '1.1'
            },
            ...this.results
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        this.downloadFile(blob, filename);
    }

    // ===== Utility Functions =====
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    calculateStatistics() {
        return {
            min: Math.min(...this.results.trials.map(t => t.accuracy || 0)),
            max: Math.max(...this.results.trials.map(t => t.accuracy || 0)),
            mean: this.results.summary.overallAccuracy,
            median: this.getMedian(this.results.trials.map(t => t.accuracy || 0))
        };
    }

    getMedian(arr) {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    getVariance(arr) {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / arr.length;
    }

    generateConclusion(results = this.results) {
        if (results) {
            this.results = results;
        }

        if (!this.results) {
            return 'No results are available yet.';
        }

        const avg = this.results.summary.overallAccuracy;
        const span = parseFloat(this.results.summary.averageSpan);
        const learning = this.results.summary.learningGain;

        let conclusion = '';

        if (avg >= 80) {
            conclusion += 'Excellent performance with very high accuracy. ';
        } else if (avg >= 60) {
            conclusion += 'Good performance with above-average accuracy. ';
        } else if (avg >= 40) {
            conclusion += 'Moderate performance with average accuracy. ';
        } else {
            conclusion += 'Lower performance, indicating challenges with the task. ';
        }

        if (span >= 7) {
            conclusion += 'The participant demonstrated a strong attention span. ';
        } else if (span >= 5) {
            conclusion += 'The participant showed a typical attention span. ';
        } else {
            conclusion += 'The participant showed a below-average attention span. ';
        }

        if (learning > 0) {
            conclusion += `There was a positive learning trend with a gain of ${learning}%. `;
        } else if (learning < 0) {
            conclusion += `Performance declined over the experiment by ${Math.abs(learning)}%. `;
        }

        conclusion += 'The results suggest that the participant\'s perceptual capacity aligns with psychological norms for attention span.';

        return conclusion;
    }
}

// Global export manager
const exportManager = new ExportManager();
