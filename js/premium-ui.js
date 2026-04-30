/**
 * Premium UI Controller
 * Manages theme switching, enhanced visuals, and premium-only helpers.
 */

class PremiumUIController {
    constructor() {
        this.isDarkMode = true;
        this.performanceChart = null;
        this.pieChart = null;
        this.profileFields = [
            { id: 'student-name', key: 'student-name' },
            { id: 'student-id', key: 'student-id' },
            { id: 'institution-name', key: 'institution-name' },
            { id: 'cohort-name', key: 'cohort-name' },
            { id: 'contact-email', key: 'contact-email' }
        ];

        this.setupThemeToggle();
        this.setupNavigationLinks();
        this.setupStudentInfoPersistence();
        this.setupConfigControls();
        this.setupSessionPresets();
        this.setupResponseAssist();
        this.setupExportButtons();
        this.syncFeatureAvailability();
        this.loadStudentInfo();
        this.refreshBusinessDashboard();
    }

    notify(message, type = 'info') {
        if (typeof uiManager !== 'undefined' && uiManager?.showNotification) {
            uiManager.showNotification(message, type);
            return;
        }

        console.log(`[${type}] ${message}`);
    }

    getThemePalette() {
        const styles = getComputedStyle(document.documentElement);

        return {
            textPrimary: styles.getPropertyValue('--text-primary').trim(),
            textSecondary: styles.getPropertyValue('--text-secondary').trim(),
            textMuted: styles.getPropertyValue('--text-muted').trim(),
            accentPrimary: styles.getPropertyValue('--accent-primary').trim(),
            accentSecondary: styles.getPropertyValue('--accent-secondary').trim(),
            accentStrong: styles.getPropertyValue('--accent-strong').trim(),
            success: styles.getPropertyValue('--success').trim(),
            warning: styles.getPropertyValue('--warning').trim(),
            chartGrid: styles.getPropertyValue('--chart-grid').trim()
        };
    }

    // ===== THEME SYSTEM =====
    setupThemeToggle() {
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('theme-toggle-config')?.addEventListener('click', () => this.toggleTheme());

        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'light') {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
    }

    toggleTheme() {
        if (this.isDarkMode) {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }
    }

    updateThemeButtons(icon) {
        document.getElementById('theme-icon')?.replaceChildren(document.createTextNode(icon));
        document.getElementById('theme-icon-config')?.replaceChildren(document.createTextNode(icon));

        const label = this.isDarkMode ? 'Dark' : 'Light';
        document.querySelectorAll('[data-theme-label]').forEach((element) => {
            element.textContent = label;
        });
    }

    setDarkMode() {
        this.isDarkMode = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        this.updateThemeButtons('☾');
        localStorage.setItem('theme-preference', 'dark');
        this.refreshCharts();
    }

    setLightMode() {
        this.isDarkMode = false;
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        this.updateThemeButtons('☀');
        localStorage.setItem('theme-preference', 'light');
        this.refreshCharts();
    }

    refreshCharts() {
        if (!experimentData?.trials?.length) {
            return;
        }

        const resultsScreen = document.getElementById('results-screen');
        if (!resultsScreen?.classList.contains('active')) {
            return;
        }

        const results = experimentData.exportResults();
        this.createPerformanceChart(results.trials);
        this.createAccuracyPieChart(results.trials);
    }

    // ===== STUDENT INFO =====
    setupStudentInfoPersistence() {
        this.profileFields.forEach(({ id }) => {
            document.getElementById(id)?.addEventListener('input', () => this.saveStudentInfo());
        });
    }

    loadStudentInfo() {
        this.profileFields.forEach(({ id, key }) => {
            const savedValue = localStorage.getItem(key);
            const input = document.getElementById(id);

            if (savedValue && input) {
                input.value = savedValue;
            }
        });
    }

    saveStudentInfo() {
        this.profileFields.forEach(({ id, key }) => {
            const value = document.getElementById(id)?.value?.trim() || '';
            localStorage.setItem(key, value);
        });
    }

    getParticipantInfo() {
        return {
            name: document.getElementById('student-name')?.value?.trim() || '',
            id: document.getElementById('student-id')?.value?.trim() || '',
            institution: document.getElementById('institution-name')?.value?.trim() || '',
            cohort: document.getElementById('cohort-name')?.value?.trim() || '',
            email: document.getElementById('contact-email')?.value?.trim() || '',
            role: 'learner'
        };
    }

    // ===== WELCOME SCREEN =====
    updateWelcomeStats() {
        const allResults = this.loadAllResults();
        const experiments = document.getElementById('stat-experiments');
        const avgSpanElement = document.getElementById('stat-avg-span');
        const accuracyElement = document.getElementById('stat-accuracy');

        if (!experiments || !avgSpanElement || !accuracyElement) {
            return;
        }

        if (allResults.length === 0) {
            experiments.textContent = '0';
            avgSpanElement.textContent = '0';
            accuracyElement.textContent = '0%';
            return;
        }

        experiments.textContent = String(allResults.length);

        const avgSpans = allResults
            .map((result) => parseFloat(result.summary.averageSpan))
            .filter((value) => Number.isFinite(value));
        const avgSpan = avgSpans.length
            ? (avgSpans.reduce((sum, value) => sum + value, 0) / avgSpans.length).toFixed(1)
            : '0';
        avgSpanElement.textContent = avgSpan;

        const bestAccuracy = Math.max(...allResults.map((result) => Number(result.summary.overallAccuracy) || 0));
        accuracyElement.textContent = `${bestAccuracy}%`;
    }

    loadAllResults() {
        try {
            const data = localStorage.getItem('tachistoscope_session_history') || localStorage.getItem('all-experiments');
            if (!data) {
                return [];
            }

            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed
                .filter((item) => item && typeof item === 'object')
                .sort((left, right) => new Date(right.timestamp || 0) - new Date(left.timestamp || 0));
        } catch {
            return [];
        }
    }

    refreshBusinessDashboard() {
        this.updateWelcomeStats();
        this.renderDashboardMetrics();
        this.renderSessionHistory();
        this.renderLeaderboard();
    }

    getDashboardStats(results = this.loadAllResults()) {
        const learners = new Set();
        const cohorts = new Set();

        let accuracyTotal = 0;
        let spanTotal = 0;

        results.forEach((result, index) => {
            const participant = result.participant || {};
            const learnerKey = `${participant.name || 'Anonymous'}::${participant.id || index}`;

            learners.add(learnerKey);
            if (participant.cohort) {
                cohorts.add(participant.cohort);
            }

            accuracyTotal += Number(result.summary?.overallAccuracy) || 0;
            spanTotal += parseFloat(result.summary?.averageSpan) || 0;
        });

        return {
            totalSessions: results.length,
            activeLearners: learners.size,
            trackedCohorts: cohorts.size,
            averageAccuracy: results.length ? Math.round(accuracyTotal / results.length) : 0,
            averageSpan: results.length ? (spanTotal / results.length).toFixed(1) : '0.0'
        };
    }

    renderDashboardMetrics() {
        const results = this.loadAllResults();
        const stats = this.getDashboardStats(results);
        const metrics = [
            ['dashboard-total-sessions', String(stats.totalSessions)],
            ['dashboard-active-learners', String(stats.activeLearners)],
            ['dashboard-cohorts', String(stats.trackedCohorts)],
            ['dashboard-avg-accuracy', `${stats.averageAccuracy}%`]
        ];

        metrics.forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        const badges = document.getElementById('dashboard-badges');
        if (!badges) {
            return;
        }

        if (!results.length) {
            badges.innerHTML = `
                <div class="insight-chip">Run a few sessions to unlock cohort benchmarks.</div>
                <div class="insight-chip">Use the institution and cohort fields to keep reports saleable.</div>
            `;
            return;
        }

        const topSession = [...results].sort((left, right) => {
            const leftScore = (Number(left.summary?.overallAccuracy) || 0) * 100 + (parseFloat(left.summary?.averageSpan) || 0);
            const rightScore = (Number(right.summary?.overallAccuracy) || 0) * 100 + (parseFloat(right.summary?.averageSpan) || 0);
            return rightScore - leftScore;
        })[0];

        const recentSession = results[0];
        const topName = topSession?.participant?.name || 'Anonymous learner';
        const topCohort = topSession?.participant?.cohort || 'General cohort';
        const recentLabel = recentSession?.participant?.institution || recentSession?.participant?.cohort || 'Independent sessions';

        badges.innerHTML = `
            <div class="insight-chip">Top performer: ${topName} • ${topSession?.summary?.overallAccuracy || 0}%</div>
            <div class="insight-chip">Strongest cohort: ${topCohort}</div>
            <div class="insight-chip">Latest activity: ${recentLabel}</div>
        `;
    }

    renderSessionHistory() {
        const tbody = document.getElementById('session-history-body');
        if (!tbody) {
            return;
        }

        const results = this.loadAllResults().slice(0, 8);
        if (!results.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty-state">No saved sessions yet. Complete a run to create your first buyer-ready record.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = results.map((result) => {
            const participant = result.participant || {};
            const participantLabel = participant.name || 'Anonymous learner';
            const cohortLabel = participant.cohort || 'General';
            const institutionLabel = participant.institution || 'Independent';
            const accuracy = Number(result.summary?.overallAccuracy) || 0;
            const avgSpan = parseFloat(result.summary?.averageSpan || 0).toFixed(1);
            const timestamp = new Date(result.timestamp).toLocaleDateString();

            return `
                <tr>
                    <td><strong>${participantLabel}</strong></td>
                    <td>${institutionLabel}</td>
                    <td>${cohortLabel}</td>
                    <td>${accuracy}%</td>
                    <td>${avgSpan}</td>
                    <td>${timestamp}</td>
                </tr>
            `;
        }).join('');
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboard-list');
        if (!container) {
            return;
        }

        const ranked = [...this.loadAllResults()]
            .sort((left, right) => {
                const leftAccuracy = Number(left.summary?.overallAccuracy) || 0;
                const rightAccuracy = Number(right.summary?.overallAccuracy) || 0;

                if (rightAccuracy !== leftAccuracy) {
                    return rightAccuracy - leftAccuracy;
                }

                return (parseFloat(right.summary?.averageSpan) || 0) - (parseFloat(left.summary?.averageSpan) || 0);
            })
            .slice(0, 5);

        if (!ranked.length) {
            container.innerHTML = '<p class="text-muted">Leaderboard entries appear automatically after the first few sessions.</p>';
            return;
        }

        container.innerHTML = ranked.map((result, index) => {
            const participant = result.participant || {};
            const participantLabel = participant.name || 'Anonymous learner';
            const cohortLabel = participant.cohort || 'General';
            const accuracy = Number(result.summary?.overallAccuracy) || 0;
            const avgSpan = parseFloat(result.summary?.averageSpan || 0).toFixed(1);

            return `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-copy">
                        <strong>${participantLabel}</strong>
                        <p>${cohortLabel} • ${accuracy}% accuracy • ${avgSpan} span</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===== CONFIG CONTROLS =====
    setupConfigControls() {
        const trialSlider = document.getElementById('trial-slider');
        const numTrialsInput = document.getElementById('num-trials');
        const sliderValue = document.getElementById('slider-value');

        const syncTrialValue = (rawValue) => {
            const value = Math.max(3, Math.min(20, parseInt(rawValue, 10) || 10));

            if (numTrialsInput) numTrialsInput.value = value;
            if (trialSlider) trialSlider.value = value;
            if (sliderValue) sliderValue.textContent = String(value);

            localStorage.setItem('num-trials', String(value));
        };

        this.syncTrialValue = syncTrialValue;

        trialSlider?.addEventListener('input', (event) => syncTrialValue(event.target.value));
        numTrialsInput?.addEventListener('input', (event) => syncTrialValue(event.target.value));

        const savedTrials = localStorage.getItem('num-trials');
        if (savedTrials) {
            syncTrialValue(savedTrials);
        }

        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetConfig());
    }

    setRadioValue(name, value) {
        document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
            input.checked = input.value === value;
        });
    }

    setupSessionPresets() {
        this.presets = {
            practice: {
                exposureTime: '0.5',
                numTrials: 6,
                stimulusType: 'letters',
                experimentMode: 'standard'
            },
            balanced: {
                exposureTime: '0.3',
                numTrials: 10,
                stimulusType: 'letters',
                experimentMode: 'standard'
            },
            challenge: {
                exposureTime: '0.1',
                numTrials: 12,
                stimulusType: 'mixed',
                experimentMode: 'adaptive'
            }
        };

        document.querySelectorAll('[data-preset]').forEach((button) => {
            button.addEventListener('click', () => {
                this.applyPreset(button.dataset.preset);
            });
        });

        [
            'input[name="exposure-time"]',
            'input[name="stimulus-type"]',
            'input[name="experiment-mode"]',
            '#num-trials'
        ].forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
                element.addEventListener('input', () => this.syncPresetHighlight());
                element.addEventListener('change', () => this.syncPresetHighlight());
            });
        });

        this.syncPresetHighlight();
    }

    applyPreset(presetName) {
        const preset = this.presets?.[presetName];
        if (!preset) return;

        this.setRadioValue('exposure-time', preset.exposureTime);
        this.setRadioValue('stimulus-type', preset.stimulusType);
        this.setRadioValue('experiment-mode', preset.experimentMode);

        if (this.syncTrialValue) {
            this.syncTrialValue(preset.numTrials);
        }

        this.syncPresetHighlight();
    }

    syncPresetHighlight() {
        if (!this.presets) return;

        const exposureTime = document.querySelector('input[name="exposure-time"]:checked')?.value;
        const stimulusType = document.querySelector('input[name="stimulus-type"]:checked')?.value;
        const experimentMode = document.querySelector('input[name="experiment-mode"]:checked')?.value;
        const numTrials = Number(document.getElementById('num-trials')?.value || 0);

        let activePreset = null;

        Object.entries(this.presets).forEach(([name, preset]) => {
            if (
                preset.exposureTime === exposureTime &&
                preset.stimulusType === stimulusType &&
                preset.experimentMode === experimentMode &&
                preset.numTrials === numTrials
            ) {
                activePreset = name;
            }
        });

        document.querySelectorAll('[data-preset]').forEach((button) => {
            const isActive = button.dataset.preset === activePreset;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    resetConfig() {
        document.querySelectorAll('input[name="exposure-time"]').forEach((input) => {
            input.checked = input.value === '0.3';
        });

        document.querySelectorAll('input[name="stimulus-type"]').forEach((input) => {
            input.checked = input.value === 'letters';
        });

        document.querySelectorAll('input[name="experiment-mode"]').forEach((input) => {
            input.checked = input.value === 'standard';
        });

        const numTrials = document.getElementById('num-trials');
        const trialSlider = document.getElementById('trial-slider');
        const sliderValue = document.getElementById('slider-value');

        if (numTrials) numTrials.value = 10;
        if (trialSlider) trialSlider.value = 10;
        if (sliderValue) sliderValue.textContent = '10';

        localStorage.removeItem('num-trials');
        this.syncPresetHighlight();
    }

    setupResponseAssist() {
        const responseInput = document.getElementById('response-input');
        responseInput?.addEventListener('input', () => this.updateResponseSubmissionState());
        this.updateResponseSubmissionState();
    }

    updateResponseSubmissionState() {
        const responseInput = document.getElementById('response-input');
        const submitButton = document.getElementById('submit-response-btn');

        if (!submitButton) {
            return;
        }

        const hasValue = !!responseInput?.value?.trim();
        submitButton.disabled = !hasValue;
    }

    // ===== NAVIGATION =====
    setupNavigationLinks() {
        [
            ['theory-btn', 'theory-anchor'],
            ['pricing-btn', 'pricing-anchor'],
            ['dashboard-btn', 'dashboard-anchor']
        ].forEach(([buttonId, targetId]) => {
            document.getElementById(buttonId)?.addEventListener('click', () => {
                document.getElementById(targetId)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // ===== EXPORTS =====
    syncFeatureAvailability() {
        const featureMap = [
            {
                id: 'export-pdf',
                available: typeof html2pdf !== 'undefined',
                message: 'PDF export activates automatically when html2pdf is bundled into /lib.'
            },
            {
                id: 'export-excel',
                available: typeof XLSX !== 'undefined',
                message: 'Excel export activates automatically when SheetJS is bundled into /lib.'
            }
        ];

        featureMap.forEach(({ id, available, message }) => {
            const button = document.getElementById(id);
            if (!button) return;

            button.disabled = !available;
            button.title = available ? '' : message;
        });
    }

    canExportResults() {
        return typeof exportManager !== 'undefined' && !!exportManager.results;
    }

    setupExportButtons() {
        document.getElementById('export-pdf')?.addEventListener('click', () => {
            if (!this.canExportResults()) {
                this.notify('Complete a session before exporting results.', 'warning');
                return;
            }
            exportManager.exportToPDF(`tachistoscope_report_${Date.now()}.pdf`);
        });

        document.getElementById('export-excel')?.addEventListener('click', () => {
            if (!this.canExportResults()) {
                this.notify('Complete a session before exporting results.', 'warning');
                return;
            }
            exportManager.exportToExcel(`tachistoscope_results_${Date.now()}.xlsx`);
        });

        document.getElementById('export-csv')?.addEventListener('click', () => {
            if (!this.canExportResults()) {
                this.notify('Complete a session before exporting results.', 'warning');
                return;
            }
            exportManager.exportToCSV(`tachistoscope_data_${Date.now()}.csv`);
        });

        document.getElementById('export-json')?.addEventListener('click', () => {
            if (!this.canExportResults()) {
                this.notify('Complete a session before exporting results.', 'warning');
                return;
            }
            exportManager.exportToJSON(`tachistoscope_results_${Date.now()}.json`);
        });

        document.getElementById('print-btn')?.addEventListener('click', () => {
            if (!this.canExportResults()) {
                this.notify('Complete a session before printing results.', 'warning');
                return;
            }
            window.print();
        });
    }

    // ===== CHARTS =====
    createPerformanceChart(trials) {
        const canvas = document.getElementById('performance-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const palette = this.getThemePalette();
        const labels = trials.map((trial) => `Trial ${trial.trialNumber}`);
        const accuracyData = trials.map((trial) => trial.accuracy);
        const reactionTimeData = trials.map((trial) => trial.reactionTime);

        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        this.performanceChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Accuracy (%)',
                        data: accuracyData,
                        borderColor: palette.accentPrimary,
                        backgroundColor: `${palette.accentPrimary}22`,
                        borderWidth: 3,
                        fill: true,
                        pointBackgroundColor: palette.accentPrimary,
                        pointBorderColor: palette.textPrimary,
                        pointRadius: 4,
                        tension: 0.35,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Reaction Time (ms)',
                        data: reactionTimeData,
                        borderColor: palette.accentSecondary,
                        backgroundColor: `${palette.accentSecondary}22`,
                        borderDash: [6, 6],
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: palette.accentSecondary,
                        pointRadius: 3,
                        tension: 0.25,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: palette.textSecondary,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: palette.textMuted
                        },
                        grid: {
                            color: palette.chartGrid
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: palette.textMuted,
                            callback: (value) => `${value}%`
                        },
                        grid: {
                            color: palette.chartGrid
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        ticks: {
                            color: palette.textMuted
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    createAccuracyPieChart(trials) {
        const canvas = document.getElementById('accuracy-pie-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const palette = this.getThemePalette();
        const correct = trials.filter((trial) => trial.isCorrect).length;
        const incorrect = trials.length - correct;

        if (this.pieChart) {
            this.pieChart.destroy();
        }

        this.pieChart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [
                    {
                        data: [correct, incorrect],
                        backgroundColor: [palette.success, palette.accentStrong],
                        borderWidth: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: {
                        labels: {
                            color: palette.textSecondary,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    displayCohortContext(results) {
        const titleElement = document.getElementById('cohort-context-title');
        const copyElement = document.getElementById('cohort-context-copy');
        const badgesElement = document.getElementById('cohort-context-badges');

        if (!titleElement || !copyElement || !badgesElement) {
            return;
        }

        const participant = results.participant || {};
        const allResults = this.loadAllResults().filter((item) => item.sessionId !== results.sessionId);
        const sameCohort = participant.cohort
            ? allResults.filter((item) => item.participant?.cohort === participant.cohort)
            : [];
        const sameInstitution = participant.institution
            ? allResults.filter((item) => item.participant?.institution === participant.institution)
            : [];

        const benchmarkPool = sameCohort.length
            ? sameCohort
            : sameInstitution.length
                ? sameInstitution
                : allResults;

        if (!benchmarkPool.length) {
            titleElement.textContent = 'Your first benchmark starts here';
            copyElement.textContent = 'This session is now saved with institution and cohort metadata. Run a few more learners through the flow to unlock real comparisons for sales demos and client reporting.';
            badgesElement.innerHTML = `
                <div class="comparison-pill">
                    <span>Current Accuracy</span>
                    <strong>${Number(results.summary?.overallAccuracy) || 0}%</strong>
                </div>
                <div class="comparison-pill">
                    <span>Current Span</span>
                    <strong>${parseFloat(results.summary?.averageSpan || 0).toFixed(1)}</strong>
                </div>
                <div class="comparison-pill">
                    <span>Next Step</span>
                    <strong>Save 2+ more sessions</strong>
                </div>
            `;
            return;
        }

        const scopeLabel = sameCohort.length
            ? `${participant.cohort} cohort`
            : sameInstitution.length
                ? `${participant.institution} benchmark`
                : 'saved sessions';
        const currentAccuracy = Number(results.summary?.overallAccuracy) || 0;
        const currentSpan = parseFloat(results.summary?.averageSpan) || 0;
        const benchmarkAccuracy = Math.round(benchmarkPool.reduce((sum, item) => sum + (Number(item.summary?.overallAccuracy) || 0), 0) / benchmarkPool.length);
        const benchmarkSpan = benchmarkPool.reduce((sum, item) => sum + (parseFloat(item.summary?.averageSpan) || 0), 0) / benchmarkPool.length;
        const accuracyDelta = currentAccuracy - benchmarkAccuracy;
        const spanDelta = currentSpan - benchmarkSpan;
        const topSession = [...benchmarkPool].sort((left, right) => (Number(right.summary?.overallAccuracy) || 0) - (Number(left.summary?.overallAccuracy) || 0))[0];

        titleElement.textContent = `Compared with the ${scopeLabel}`;
        copyElement.textContent = `This learner finished ${accuracyDelta >= 0 ? Math.abs(accuracyDelta) + ' points above' : Math.abs(accuracyDelta) + ' points below'} the typical accuracy in your ${scopeLabel}. Span performance is ${spanDelta >= 0 ? Math.abs(spanDelta).toFixed(1) + ' items higher' : Math.abs(spanDelta).toFixed(1) + ' items lower'} than that benchmark.`;
        badgesElement.innerHTML = `
            <div class="comparison-pill">
                <span>Your Accuracy</span>
                <strong>${currentAccuracy}%</strong>
            </div>
            <div class="comparison-pill">
                <span>${scopeLabel} Avg</span>
                <strong>${benchmarkAccuracy}%</strong>
            </div>
            <div class="comparison-pill">
                <span>Top Session</span>
                <strong>${topSession?.participant?.name || 'Anonymous'} • ${topSession?.summary?.overallAccuracy || 0}%</strong>
            </div>
        `;
    }

    // ===== INSIGHTS =====
    displayInsights() {
        if (typeof insightsCalculator === 'undefined' || !experimentData?.trials?.length) {
            return;
        }

        const results = experimentData.exportResults();
        insightsCalculator.setResults(results);
        const insights = insightsCalculator.generateInsights();

        const markup = insights.map((insight) => `
            <div class="insight-item">
                <span class="insight-icon">${insight.icon}</span>
                <div>
                    <strong>${insight.title}</strong>
                    <p class="insight-text">${insight.text}</p>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('[data-insights-container]').forEach((container) => {
            container.innerHTML = markup;
        });
    }

    // ===== THEORY & CONCLUSIONS =====
    displayTheoryAndConclusions(results) {
        const conclusionElement = document.getElementById('conclusion-text');
        const theorySectionElement = document.getElementById('theory-section');

        if (typeof exportManager !== 'undefined') {
            exportManager.setResults(results);
        }

        if (conclusionElement && typeof exportManager !== 'undefined') {
            conclusionElement.textContent = exportManager.generateConclusion(results);
        }

        if (theorySectionElement) {
            theorySectionElement.innerHTML = this.getTheoryContent();
        }
    }

    getTheoryContent() {
        return `
            <div class="theory-stack">
                <div class="theory-topic">
                    <h4>Immediate Apprehension</h4>
                    <p>Span of attention reflects how much information can be grasped in one brief visual moment before deliberate rehearsal begins.</p>
                </div>
                <div class="theory-topic">
                    <h4>Typical Human Range</h4>
                    <ul>
                        <li>Many participants identify around 4 to 7 simple items at moderate exposure durations.</li>
                        <li>Order accuracy usually drops before basic item recognition does.</li>
                    </ul>
                </div>
                <div class="theory-topic">
                    <h4>Why scores shift</h4>
                    <ul>
                        <li>Shorter exposure times increase reliance on rapid attentional capture.</li>
                        <li>Words and mixed stimuli create extra perceptual and semantic load.</li>
                        <li>Practice can improve chunking, confidence, and recall rhythm.</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // ===== PROGRESS =====
    updateProgressBar(current, total) {
        const fill = document.getElementById('progress-fill');
        if (!fill || total <= 0) return;

        fill.style.width = `${(current / total) * 100}%`;
    }
}

const premiumUI = new PremiumUIController();
