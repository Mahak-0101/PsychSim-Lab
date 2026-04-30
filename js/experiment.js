/**
 * Experiment Module
 * Controls the main experiment flow and logic
 */

class TachistoscopeExperiment {
    constructor() {
        this.state = 'welcome'; // welcome, config, lab, response, results, summary
        this.config = {
            exposureTime: 0.3,
            numTrials: 10,
            stimulusType: 'letters',
            experimentMode: 'standard',
            minItems: 3,
            maxItems: 8,
            minExposureTime: 0.1,
            maxExposureTime: 1.0,
            adaptiveStep: 0.05
        };
        this.currentTrial = 0;
        this.isRunning = false;
        this.responseStartTime = null;
        this.pendingTrialParameters = null;
        this.trialState = {
            exposureTime: this.config.exposureTime,
            stimulusCount: 5
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Welcome screen
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.goToConfig());
        }

        // Config screen
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goToWelcome());
        }

        const startTestBtn = document.getElementById('start-test-btn');
        if (startTestBtn) {
            startTestBtn.addEventListener('click', () => this.startExperiment());
        }

        // Lab screen
        const labExitBtn = document.getElementById('lab-exit-btn');
        if (labExitBtn) {
            labExitBtn.addEventListener('click', () => this.exitExperiment());
        }

        // Response screen
        const responseInput = document.getElementById('response-input');
        if (responseInput) {
            responseInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitResponse();
                }
            });
        }

        const submitBtn = document.getElementById('submit-response-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitResponse());
        }

        const skipBtn = document.getElementById('skip-trial-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipTrial());
        }

        // Results screen
        const continueSummaryBtn = document.getElementById('continue-to-summary-btn');
        if (continueSummaryBtn) {
            continueSummaryBtn.addEventListener('click', () => this.goToSummary());
        }

        // Summary screen
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.goToWelcome());
        }

        const exitBtn = document.getElementById('exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitExperiment());
        }
    }

    goToWelcome() {
        this.changeScreen('welcome-screen');
        this.state = 'welcome';
        uiManager?.hideLoadingOverlay();

        if (typeof premiumUI !== 'undefined' && premiumUI.refreshBusinessDashboard) {
            premiumUI.refreshBusinessDashboard();
        } else if (typeof premiumUI !== 'undefined' && premiumUI.updateWelcomeStats) {
            premiumUI.updateWelcomeStats();
        }
    }

    goToConfig() {
        this.changeScreen('config-screen');
        this.state = 'config';
    }

    startExperiment() {
        if (typeof premiumUI !== 'undefined' && premiumUI.saveStudentInfo) {
            premiumUI.saveStudentInfo();
        }

        if (typeof premiumUI !== 'undefined' && premiumUI.getParticipantInfo) {
            experimentData.setParticipant(premiumUI.getParticipantInfo());
        }

        // Read configuration from form
        const exposureTimeRadios = document.querySelectorAll('input[name="exposure-time"]:checked');
        const stimulusTypeRadios = document.querySelectorAll('input[name="stimulus-type"]:checked');
        const experimentModeRadios = document.querySelectorAll('input[name="experiment-mode"]:checked');
        const numTrialsInput = document.getElementById('num-trials');

        if (exposureTimeRadios.length > 0) {
            this.config.exposureTime = parseFloat(exposureTimeRadios[0].value);
        }
        if (stimulusTypeRadios.length > 0) {
            this.config.stimulusType = stimulusTypeRadios[0].value;
        }
        if (experimentModeRadios.length > 0) {
            this.config.experimentMode = experimentModeRadios[0].value;
        }
        if (numTrialsInput) {
            this.config.numTrials = parseInt(numTrialsInput.value);
        }

        experimentData.setConfig(this.config);
        this.currentTrial = 0;
        this.isRunning = true;
        this.pendingTrialParameters = null;
        this.trialState = {
            exposureTime: this.config.exposureTime,
            stimulusCount: 5
        };

        // Initialize scene
        initializeLabScene();
        initializeTachistoscope();

        // Update display info
        this.updateTrialCounter();

        this.changeScreen('lab-screen');
        this.state = 'lab';
        uiManager?.createLoadingOverlay('Preparing your session...');

        // Start first trial after a brief delay
        setTimeout(() => this.runTrial(), 1000);
    }

    async runTrial() {
        if (this.currentTrial >= this.config.numTrials) {
            this.showResults();
            return;
        }

        uiManager?.hideLoadingOverlay();

        const trialParameters = this.prepareTrialParameters();

        // Generate stimulus
        const stimulus = tachistoscope.generateStimulus(
            this.config.stimulusType,
            trialParameters.stimulusCount,
            trialParameters.stimulusCount
        );

        // Present stimulus
        await tachistoscope.presentStimulus(stimulus, trialParameters.exposureTime);

        // Show response screen
        this.changeScreen('response-screen');
        this.state = 'response';
        this.responseStartTime = Date.now();

        // Focus on input field
        const responseInput = document.getElementById('response-input');
        if (responseInput) {
            responseInput.value = '';
            responseInput.focus();
        }

        if (typeof premiumUI !== 'undefined' && premiumUI.updateResponseSubmissionState) {
            premiumUI.updateResponseSubmissionState();
        }

        // Update hint
        const stimulusHint = document.getElementById('stimulus-hint');
        if (stimulusHint) {
            const itemCount = stimulus.split(' ').length;
            stimulusHint.textContent = `You saw ${itemCount} item(s) in ${trialParameters.exposureTime.toFixed(2)}s. Enter what you remember, even if it is only part of the stimulus.`;
        }

        const difficultyDisplay = document.getElementById('difficulty-display');
        if (difficultyDisplay) {
            difficultyDisplay.textContent = `${this.config.experimentMode === 'adaptive' ? 'Adaptive' : 'Standard'} • ${trialParameters.stimulusCount} items`;
        }
    }

    submitResponse() {
        const responseInput = document.getElementById('response-input');
        const response = responseInput ? responseInput.value.trim() : '';

        if (!response) {
            if (typeof premiumUI !== 'undefined' && premiumUI.notify) {
                premiumUI.notify('Type what you remember, or choose Skip Trial if you truly saw nothing.', 'warning');
            } else {
                alert('Please enter a response before submitting.');
            }
            responseInput?.focus();
            return;
        }

        const stimulus = tachistoscope.getCurrentStimulus();
        const reactionTime = Date.now() - this.responseStartTime;
        const trialParameters = this.getCurrentTrialParameters();
        const metrics = this.calculateResponseMetrics(stimulus, response);

        // Calculate accuracy
        const accuracy = metrics.accuracy;
        const isCorrect = metrics.correctCount === metrics.stimulusCount;

        // Show feedback
        this.showFeedback(stimulus, response, isCorrect, accuracy, metrics);

        // Record trial data
        experimentData.addTrial(stimulus, response, isCorrect, accuracy, reactionTime, {
            stimulusCount: metrics.stimulusCount,
            exposureTime: trialParameters.exposureTime,
            difficultyLabel: this.getDifficultyLabel(trialParameters)
        });

        this.applyAdaptiveAdjustment(metrics);
        this.pendingTrialParameters = null;

        // Move to next trial after a brief delay
        this.currentTrial++;
        setTimeout(() => {
            this.hideFeedback();
            if (this.currentTrial < this.config.numTrials) {
                this.changeScreen('lab-screen');
                this.state = 'lab';
                this.updateTrialCounter();
                this.runTrial();
            } else {
                this.showResults();
            }
        }, 2000);
    }

    skipTrial() {
        this.hideFeedback();
        const stimulus = tachistoscope.getCurrentStimulus();
        const trialParameters = this.getCurrentTrialParameters();
        experimentData.addTrial(stimulus, '', false, 0, 0, {
            stimulusCount: trialParameters.stimulusCount,
            exposureTime: trialParameters.exposureTime,
            difficultyLabel: this.getDifficultyLabel(trialParameters)
        });
        this.applyAdaptiveAdjustment({ accuracy: 0, correctCount: 0, stimulusCount: trialParameters.stimulusCount });
        this.pendingTrialParameters = null;
        this.currentTrial++;

        if (this.currentTrial < this.config.numTrials) {
            this.changeScreen('lab-screen');
            this.state = 'lab';
            this.updateTrialCounter();
            this.runTrial();
        } else {
            this.showResults();
        }
    }

    normalizeItem(item) {
        return item.toLowerCase().trim();
    }

    prepareTrialParameters() {
        if (this.pendingTrialParameters) {
            return this.pendingTrialParameters;
        }

        this.pendingTrialParameters = this.config.experimentMode === 'adaptive'
            ? {
                exposureTime: this.trialState.exposureTime,
                stimulusCount: this.trialState.stimulusCount
            }
            : {
                exposureTime: this.config.exposureTime,
                stimulusCount: this.getStandardStimulusCount()
            };

        if (this.config.experimentMode !== 'adaptive') {
            this.trialState.stimulusCount = this.pendingTrialParameters.stimulusCount;
        }

        return this.pendingTrialParameters;
    }

    getCurrentTrialParameters() {
        return this.pendingTrialParameters || {
            exposureTime: this.config.exposureTime,
            stimulusCount: this.trialState.stimulusCount
        };
    }

    getStandardStimulusCount() {
        return Math.max(this.config.minItems, Math.min(this.config.maxItems, Math.floor(Math.random() * 6) + 3));
    }

    calculateResponseMetrics(stimulus, response) {
        const stimulusItems = stimulus ? stimulus.split(/\s+/).filter(item => item.length > 0) : [];
        const responseItems = response ? response.split(/\s+/).filter(item => item.length > 0) : [];
        const stimulusCount = stimulusItems.length;

        let correctCount = 0;
        for (let i = 0; i < Math.min(stimulusItems.length, responseItems.length); i++) {
            if (this.normalizeItem(stimulusItems[i]) === this.normalizeItem(responseItems[i])) {
                correctCount++;
            }
        }

        const accuracy = stimulusCount > 0 ? Math.round((correctCount / stimulusCount) * 100) : 0;
        const orderMatches = correctCount;
        const orderAccuracy = stimulusCount > 0 ? Math.round((orderMatches / stimulusCount) * 100) : 0;
        const completenessScore = stimulusCount > 0 ? Math.round((responseItems.length / stimulusCount) * 100) : 0;

        return {
            stimulusCount,
            responseCount: responseItems.length,
            correctCount,
            accuracy,
            orderAccuracy,
            completenessScore
        };
    }

    getDifficultyLabel(trialParameters) {
        return `${this.config.experimentMode === 'adaptive' ? 'Adaptive' : 'Standard'} • ${trialParameters.stimulusCount} items • ${trialParameters.exposureTime.toFixed(2)}s`;
    }

    applyAdaptiveAdjustment(metrics) {
        if (this.config.experimentMode !== 'adaptive') {
            return;
        }

        if (metrics.accuracy >= 80) {
            this.trialState.exposureTime = Math.max(this.config.minExposureTime, this.trialState.exposureTime - this.config.adaptiveStep);
            this.trialState.stimulusCount = Math.min(this.config.maxItems, this.trialState.stimulusCount + 1);
        } else if (metrics.accuracy <= 50) {
            this.trialState.exposureTime = Math.min(this.config.maxExposureTime, this.trialState.exposureTime + this.config.adaptiveStep);
            this.trialState.stimulusCount = Math.max(this.config.minItems, this.trialState.stimulusCount - 1);
        }
    }

    showFeedback(stimulus, response, isCorrect, accuracy, metrics = null) {
        const feedbackBox = document.getElementById('response-feedback');
        const feedbackMessage = document.getElementById('feedback-message');

        if (feedbackBox && feedbackMessage) {
            feedbackBox.style.display = 'block';
            feedbackBox.className = isCorrect ? 'feedback-box correct' : 'feedback-box incorrect';

            if (isCorrect) {
                feedbackMessage.textContent = '✓ Correct! You identified all items accurately.';
            } else {
                const orderAccuracy = metrics ? metrics.orderAccuracy : accuracy;
                const completenessScore = metrics ? metrics.completenessScore : 0;
                feedbackMessage.innerHTML = `<strong>Stimulus:</strong> ${stimulus}<br><strong>Your Response:</strong> ${response}<br><strong>Item Accuracy:</strong> ${accuracy}%<br><strong>Order Match:</strong> ${orderAccuracy}%<br><strong>Completeness:</strong> ${completenessScore}%`;
            }
        }
    }

    hideFeedback() {
        const feedbackBox = document.getElementById('response-feedback');
        if (feedbackBox) {
            feedbackBox.style.display = 'none';
        }

        const responseInput = document.getElementById('response-input');
        if (responseInput) {
            responseInput.value = '';
        }

        if (typeof premiumUI !== 'undefined' && premiumUI.updateResponseSubmissionState) {
            premiumUI.updateResponseSubmissionState();
        }
    }

    updateTrialCounter() {
        const trialParameters = this.getCurrentTrialParameters();
        const counter = document.getElementById('trial-counter');
        if (counter) {
            counter.textContent = `Trial ${this.currentTrial + 1}/${this.config.numTrials}`;
        }

        const exposureDisplay = document.getElementById('exposure-display');
        if (exposureDisplay) {
            exposureDisplay.textContent = `${trialParameters.exposureTime.toFixed(2)}s`;
        }

        const accuracyDisplay = document.getElementById('accuracy-display');
        if (accuracyDisplay) {
            const currentAccuracy = experimentData.getOverallAccuracy();
            accuracyDisplay.textContent = `${currentAccuracy}%`;
        }

        const difficultyDisplay = document.getElementById('difficulty-display');
        if (difficultyDisplay) {
            difficultyDisplay.textContent = this.getDifficultyLabel(trialParameters);
        }
    }

    showResults() {
        this.state = 'results';
        this.changeScreen('results-screen');
        this.displayResults();
    }

    displayResults() {
        const results = experimentData.exportResults();

        if (typeof exportManager !== 'undefined' && exportManager.setResults) {
            exportManager.setResults(results);
        }

        const totalTrialsElement = document.getElementById('result-total-trials');
        if (totalTrialsElement) {
            totalTrialsElement.textContent = String(results.trials.length);
        }

        const accuracyElement = document.getElementById('result-accuracy');
        if (accuracyElement) {
            accuracyElement.textContent = results.summary.overallAccuracy + '%';
        }

        const avgSpanElement = document.getElementById('result-avg-span');
        if (avgSpanElement) {
            avgSpanElement.textContent = results.summary.averageSpan;
        }

        const avgTimeElement = document.getElementById('result-avg-time');
        if (avgTimeElement) {
            avgTimeElement.textContent = results.summary.averageReactionTime + 'ms';
        }

        const bestSpanElement = document.getElementById('result-best-span');
        if (bestSpanElement) {
            bestSpanElement.textContent = results.summary.bestSpanEstimate;
        }

        const orderMatchElement = document.getElementById('result-order-match');
        if (orderMatchElement) {
            orderMatchElement.textContent = results.summary.averageOrderAccuracy + '%';
        }

        // Populate results table
        const tbody = document.getElementById('results-tbody');
        if (tbody) {
            tbody.innerHTML = '';

            results.trials.forEach((trial) => {
                const statusLabel = trial.isCorrect
                    ? 'Exact'
                    : trial.response
                        ? 'Partial'
                        : 'Skipped';
                const statusClass = trial.isCorrect
                    ? 'success'
                    : trial.response
                        ? 'warning'
                        : 'danger';
                const reactionTimeLabel = trial.reactionTime > 0 ? `${trial.reactionTime}ms` : '&mdash;';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trial.trialNumber}</td>
                    <td><strong>${trial.stimulus}</strong></td>
                    <td>${trial.response || '(skipped)'}</td>
                    <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                    <td>${trial.accuracy}%</td>
                    <td>${reactionTimeLabel}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Create performance chart - use premium UI if available
        if (typeof premiumUI !== 'undefined' && premiumUI.createPerformanceChart) {
            premiumUI.createPerformanceChart(results.trials);
            premiumUI.createAccuracyPieChart(results.trials);
            premiumUI.displayInsights();
            premiumUI.displayTheoryAndConclusions(results);
            premiumUI.displayCohortContext(results);
        } else {
            // Fallback to basic chart
            this.createPerformanceChart(results.trials);
        }

        // Update progress bar if available
        if (typeof premiumUI !== 'undefined' && premiumUI.updateProgressBar) {
            premiumUI.updateProgressBar(results.trials.length, results.trials.length);
        }

        // Save results
        experimentData.saveToLocalStorage();

        if (typeof premiumUI !== 'undefined' && premiumUI.refreshBusinessDashboard) {
            premiumUI.refreshBusinessDashboard();
        } else if (typeof premiumUI !== 'undefined' && premiumUI.updateWelcomeStats) {
            premiumUI.updateWelcomeStats();
        }
    }

    createPerformanceChart(trials) {
        const ctx = document.getElementById('performance-chart');
        if (!ctx || typeof Chart === 'undefined') return;

        const labels = trials.map((_, i) => `Trial ${i + 1}`);
        const accuracyData = trials.map(t => t.accuracy);
        const stimulusSizeData = trials.map(t => t.totalItems || t.stimulusCount || 0);

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Accuracy (%)',
                        data: accuracyData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#764ba2',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Stimulus Items',
                        data: stimulusSizeData,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: false,
                        pointBackgroundColor: '#2ecc71',
                        pointBorderColor: '#27ae60',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#333',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        suggestedMax: 10,
                        ticks: {
                            color: '#2d8f4e'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    goToSummary() {
        this.state = 'summary';
        this.changeScreen('summary-screen');
        this.displaySummary();
    }

    displaySummary() {
        const results = experimentData.exportResults();
        const avgSpan = parseFloat(results.summary.averageSpan) || 0;

        const spanElement = document.getElementById('summary-span');
        if (spanElement) {
            spanElement.textContent = avgSpan.toFixed(1) + ' items';
        }

        const bestSpanElement = document.getElementById('summary-best-span');
        if (bestSpanElement) {
            bestSpanElement.textContent = results.summary.bestSpanEstimate;
        }

        const orderMatchElement = document.getElementById('summary-order-match');
        if (orderMatchElement) {
            orderMatchElement.textContent = results.summary.averageOrderAccuracy + '%';
        }

        const learningGainElement = document.getElementById('summary-learning-gain');
        if (learningGainElement) {
            const gain = results.summary.learningGain;
            learningGainElement.textContent = (gain >= 0 ? '+' : '') + gain + '%';
        }

        const modeElement = document.getElementById('summary-mode');
        if (modeElement) {
            modeElement.textContent = this.config.experimentMode === 'adaptive' ? 'Adaptive' : 'Standard';
        }

        if (typeof exportManager !== 'undefined' && exportManager.setResults) {
            exportManager.setResults(results);
        }

        if (typeof premiumUI !== 'undefined' && premiumUI.displayInsights) {
            premiumUI.displayInsights();
        }
    }

    changeScreen(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.scrollTo(0, 0);
        }
    }

    exitExperiment() {
        if (confirm('Are you sure you want to exit the experiment?')) {
            this.isRunning = false;
            tachistoscope?.clearDisplay();
            uiManager?.hideLoadingOverlay();
            this.goToWelcome();
        }
    }
}

// Global experiment instance
let experiment = null;

function initializeExperiment() {
    if (!experiment) {
        experiment = new TachistoscopeExperiment();
    }
    return experiment;
}
