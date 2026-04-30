/**
 * Data Management Module
 * Handles experiment data, storage, and analysis
 */

const STORAGE_KEYS = {
    latestSession: 'tachistoscope_results',
    sessionHistory: 'tachistoscope_session_history',
    legacyHistory: 'all-experiments'
};

const MAX_SAVED_SESSIONS = 120;

class ExperimentData {
    constructor() {
        this.trials = [];
        this.config = {
            exposureTime: 0.3,
            numTrials: 10,
            stimulusType: 'letters',
            experimentMode: 'standard',
            minItems: 3,
            maxItems: 8
        };
        this.currentTrial = 0;
        this.startTime = null;
        this.sessionId = this.generateSessionId();
        this.participant = {
            name: '',
            id: '',
            institution: '',
            cohort: '',
            email: '',
            role: 'learner'
        };
    }

    setConfig(config) {
        this.config = { ...config };
        this.trials = [];
        this.currentTrial = 0;
        this.sessionId = this.generateSessionId();
    }

    setParticipant(participant = {}) {
        this.participant = {
            ...this.participant,
            ...participant
        };
    }

    getParticipant() {
        return { ...this.participant };
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    addTrial(stimulus, response, isCorrect, accuracy, reactionTime, meta = {}) {
        const stimulusItems = stimulus ? stimulus.split(/\s+/).filter(item => item.length > 0) : [];
        const responseItems = response ? response.split(/\s+/).filter(item => item.length > 0) : [];
        const orderMatches = this.countOrderMatches(stimulusItems, responseItems);
        const totalItems = stimulusItems.length || meta.totalItems || 0;

        this.trials.push({
            trialNumber: this.currentTrial + 1,
            stimulus: stimulus,
            response: response || '',
            isCorrect: isCorrect,
            accuracy: accuracy, // percentage of correct items
            reactionTime: reactionTime || 0,
            itemsCorrect: this.countCorrectItems(stimulus, response),
            totalItems: totalItems,
            stimulusCount: meta.stimulusCount || totalItems,
            exposureTime: meta.exposureTime || this.config.exposureTime,
            difficultyLabel: meta.difficultyLabel || 'Standard',
            orderMatches: orderMatches,
            orderAccuracy: totalItems > 0 ? Math.round((orderMatches / totalItems) * 100) : 0,
            completenessScore: totalItems > 0 ? Math.round((responseItems.length / totalItems) * 100) : 0
        });
        this.currentTrial++;
    }

    countOrderMatches(stimulusItems, responseItems) {
        if (!stimulusItems.length || !responseItems.length) return 0;

        let matches = 0;
        for (let i = 0; i < Math.min(stimulusItems.length, responseItems.length); i++) {
            if (this.normalizeItem(stimulusItems[i]) === this.normalizeItem(responseItems[i])) {
                matches++;
            }
        }
        return matches;
    }

    countCorrectItems(stimulus, response) {
        if (!stimulus || !response) return 0;
        
        const stimulusItems = stimulus.split(/\s+/).filter(item => item.length > 0);
        const responseItems = response.split(/\s+/).filter(item => item.length > 0);
        
        let correct = 0;
        for (let i = 0; i < Math.min(stimulusItems.length, responseItems.length); i++) {
            if (this.normalizeItem(stimulusItems[i]) === this.normalizeItem(responseItems[i])) {
                correct++;
            }
        }
        return correct;
    }

    normalizeItem(item) {
        return item.toLowerCase().trim();
    }

    getOverallAccuracy() {
        if (this.trials.length === 0) return 0;
        const totalAccuracy = this.trials.reduce((sum, trial) => sum + trial.accuracy, 0);
        return Math.round(totalAccuracy / this.trials.length);
    }

    getAverageSpan() {
        if (this.trials.length === 0) return 0;
        const totalItems = this.trials.reduce((sum, trial) => sum + trial.itemsCorrect, 0);
        return (totalItems / this.trials.length).toFixed(2);
    }

    getAverageReactionTime() {
        if (this.trials.length === 0) return 0;
        const totalTime = this.trials.reduce((sum, trial) => sum + trial.reactionTime, 0);
        return Math.round(totalTime / this.trials.length);
    }

    getBestSpanEstimate() {
        if (this.trials.length === 0) return 0;
        return Math.max(...this.trials.map(trial => trial.itemsCorrect || 0));
    }

    getAverageOrderAccuracy() {
        if (this.trials.length === 0) return 0;
        const total = this.trials.reduce((sum, trial) => sum + (trial.orderAccuracy || 0), 0);
        return Math.round(total / this.trials.length);
    }

    getLearningGain() {
        if (this.trials.length < 2) return 0;

        const window = Math.min(3, this.trials.length);
        const firstWindow = this.trials.slice(0, window);
        const lastWindow = this.trials.slice(-window);
        const firstAverage = firstWindow.reduce((sum, trial) => sum + trial.accuracy, 0) / firstWindow.length;
        const lastAverage = lastWindow.reduce((sum, trial) => sum + trial.accuracy, 0) / lastWindow.length;

        return Math.round(lastAverage - firstAverage);
    }

    getTrialDetails() {
        return this.trials;
    }

    exportResults() {
        return {
            sessionId: this.sessionId,
            participant: this.getParticipant(),
            config: this.config,
            summary: {
                totalTrials: this.trials.length,
                overallAccuracy: this.getOverallAccuracy(),
                averageSpan: this.getAverageSpan(),
                averageReactionTime: this.getAverageReactionTime(),
                bestSpanEstimate: this.getBestSpanEstimate(),
                averageOrderAccuracy: this.getAverageOrderAccuracy(),
                learningGain: this.getLearningGain()
            },
            trials: this.trials,
            timestamp: new Date().toISOString()
        };
    }

    saveToLocalStorage() {
        try {
            const results = this.exportResults();
            localStorage.setItem(STORAGE_KEYS.latestSession, JSON.stringify(results));

            const history = this.loadSessionHistory();
            const existingIndex = history.findIndex((session) => session.sessionId === results.sessionId);

            if (existingIndex >= 0) {
                history[existingIndex] = results;
            } else {
                history.unshift(results);
            }

            const trimmedHistory = history.slice(0, MAX_SAVED_SESSIONS);
            localStorage.setItem(STORAGE_KEYS.sessionHistory, JSON.stringify(trimmedHistory));

            // Keep the original key in sync so older UI code or saved builds still work.
            localStorage.setItem(STORAGE_KEYS.legacyHistory, JSON.stringify(trimmedHistory));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.latestSession);
            if (data) {
                return this.normalizeSavedResult(JSON.parse(data));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return null;
    }

    loadSessionHistory() {
        try {
            const primary = localStorage.getItem(STORAGE_KEYS.sessionHistory);
            const legacy = localStorage.getItem(STORAGE_KEYS.legacyHistory);
            const raw = primary || legacy;

            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed
                .map((item, index) => this.normalizeSavedResult(item, index))
                .filter(Boolean)
                .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));
        } catch (error) {
            console.error('Error loading session history:', error);
            return [];
        }
    }

    normalizeSavedResult(result, index = 0) {
        if (!result || typeof result !== 'object') {
            return null;
        }

        return {
            ...result,
            sessionId: result.sessionId || `legacy_session_${index}_${result.timestamp || 'unknown'}`,
            participant: {
                name: '',
                id: '',
                institution: '',
                cohort: '',
                email: '',
                role: 'learner',
                ...(result.participant || {})
            },
            config: result.config || { ...this.config },
            summary: result.summary || {},
            trials: Array.isArray(result.trials) ? result.trials : [],
            timestamp: result.timestamp || new Date().toISOString()
        };
    }
}

// Global experiment data instance
const experimentData = new ExperimentData();
