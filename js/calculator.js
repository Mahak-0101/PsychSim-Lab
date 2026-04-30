/**
 * Smart Insights Engine
 * Auto-generates intelligent conclusions and recommendations
 */

class InsightsCalculator {
    constructor() {
        this.results = null;
    }

    setResults(results) {
        this.results = results;
    }

    generateInsights() {
        if (!this.results) return [];

        const insights = [];

        // Performance Level
        insights.push(...this.analyzePerformanceLevel());

        // Attention Span
        insights.push(...this.analyzeAttentionSpan());

        // Learning Pattern
        insights.push(...this.analyzeLearningPattern());

        // Stimulus Type Performance
        insights.push(...this.analyzeStimulusPerformance());

        // Reaction Time
        insights.push(...this.analyzeReactionTime());

        // Consistency
        insights.push(...this.analyzeConsistency());

        return insights;
    }

    analyzePerformanceLevel() {
        const acc = this.results.summary.overallAccuracy;
        const insights = [];

        if (acc >= 90) {
            insights.push({
                icon: '⭐',
                title: 'Exceptional Performance',
                text: `Outstanding accuracy of ${acc}%. Your perceptual processing is well above average.`
            });
        } else if (acc >= 75) {
            insights.push({
                icon: '✅',
                title: 'Strong Performance',
                text: `Good accuracy level at ${acc}%. You demonstrated solid attention and recall abilities.`
            });
        } else if (acc >= 60) {
            insights.push({
                icon: '👍',
                title: 'Average Performance',
                text: `Moderate accuracy of ${acc}%. Your results align with typical attention span ranges.`
            });
        } else if (acc >= 40) {
            insights.push({
                icon: '⚠️',
                title: 'Below Average Performance',
                text: `Lower accuracy of ${acc}%. Consider that fatigue or concentration may have affected results.`
            });
        } else {
            insights.push({
                icon: '📊',
                title: 'Challenging Performance',
                text: `Accuracy of ${acc}% suggests the task was quite challenging. Try practicing with longer exposure times.`
            });
        }

        return insights;
    }

    analyzeAttentionSpan() {
        const span = parseFloat(this.results.summary.averageSpan);
        const best = this.results.summary.bestSpanEstimate;
        const insights = [];

        if (span >= 7 && best >= 8) {
            insights.push({
                icon: '👁️',
                title: 'Strong Attention Span',
                text: `You demonstrated an excellent average span of ${span} items with a peak of ${best} items.`
            });
        } else if (span >= 5 && best >= 6) {
            insights.push({
                icon: '👁️',
                title: 'Typical Attention Span',
                text: `Your span of ${span} items fits within the typical 5-7 item range (Miller\'s Magical Number).`
            });
        } else if (span >= 3) {
            insights.push({
                icon: '🔍',
                title: 'Focused Attention',
                text: `Lower span of ${span} items may indicate selective attention or need for longer exposure times.`
            });
        }

        return insights;
    }

    analyzeLearningPattern() {
        const gain = this.results.summary.learningGain;
        const insights = [];

        if (gain > 15) {
            insights.push({
                icon: '📈',
                title: 'Strong Learning Curve',
                text: `Impressive improvement of ${gain}% across trials. You adapted well to the task demands.`
            });
        } else if (gain > 5) {
            insights.push({
                icon: '↗️',
                title: 'Positive Learning Trend',
                text: `Gradual improvement of ${gain}% shows you benefited from practice and familiarity.`
            });
        } else if (gain > -5) {
            insights.push({
                icon: '➡️',
                title: 'Stable Performance',
                text: `Consistent performance throughout with minimal fluctuation, indicating steady attention.`
            });
        } else {
            insights.push({
                icon: '📉',
                title: 'Fatigue Effect',
                text: `Performance declined by ${Math.abs(gain)}% over trials, possibly due to cognitive fatigue.`
            });
        }

        return insights;
    }

    analyzeStimulusPerformance() {
        const type = this.results.config.stimulusType;
        const insights = [];

        // Check if performance varies by stimulus characteristics
        const trials = this.results.trials;
        const accuracyVariance = Math.max(...trials.map(t => t.accuracy || 0)) - Math.min(...trials.map(t => t.accuracy || 0));

        if (accuracyVariance > 40) {
            insights.push({
                icon: '🎯',
                title: 'Stimulus Sensitivity',
                text: `High variability (${accuracyVariance}%) suggests your performance depends on stimulus characteristics.`
            });
        } else {
            insights.push({
                icon: '💪',
                title: 'Consistent Processing',
                text: `Low variability indicates consistent stimulus processing regardless of content type.`
            });
        }

        return insights;
    }

    analyzeReactionTime() {
        const avgRT = this.results.summary.averageReactionTime;
        const minRT = Math.min(...this.results.trials.map(t => t.reactionTime || 0));
        const maxRT = Math.max(...this.results.trials.map(t => t.reactionTime || 0));
        const insights = [];

        if (avgRT < 1000) {
            insights.push({
                icon: '⚡',
                title: 'Quick Response',
                text: `Average response time of ${avgRT}ms shows prompt processing and decision-making.`
            });
        } else if (avgRT < 2000) {
            insights.push({
                icon: '⏱️',
                title: 'Moderate Response Time',
                text: `Average of ${avgRT}ms is typical, reflecting a balance between speed and accuracy.`
            });
        } else {
            insights.push({
                icon: '🤔',
                title: 'Deliberate Responses',
                text: `Longer response time (${avgRT}ms) suggests careful consideration before responding.`
            });
        }

        return insights;
    }

    analyzeConsistency() {
        const trials = this.results.trials;
        const accuracies = trials.map(t => t.accuracy || 0);
        const variance = this.calculateVariance(accuracies);
        const stdev = Math.sqrt(variance);
        const insights = [];

        if (stdev < 15) {
            insights.push({
                icon: '✓',
                title: 'Highly Consistent',
                text: `Low standard deviation (${stdev.toFixed(1)}) indicates reliable and stable attention.`
            });
        } else if (stdev < 25) {
            insights.push({
                icon: '→',
                title: 'Moderately Consistent',
                text: `Moderate variability suggests occasional fluctuations in focus and concentration.`
            });
        } else {
            insights.push({
                icon: '⚡',
                title: 'Highly Variable',
                text: `High variability suggests performance depends heavily on trial-specific factors or attention state.`
            });
        }

        return insights;
    }

    calculateVariance(arr) {
        if (arr.length === 0) return 0;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / arr.length;
    }

    generateRecommendations() {
        const insights = this.generateInsights();
        const recommendations = [];

        const acc = this.results.summary.overallAccuracy;

        if (acc < 50) {
            recommendations.push('Consider practicing with longer exposure times to improve accuracy.');
            recommendations.push('Try simpler stimulus types (e.g., numbers, shapes) before attempting words.');
            recommendations.push('Ensure you\'re in a focused, distraction-free environment.');
        }

        if (acc >= 80) {
            recommendations.push('Try shorter exposure times to challenge your perceptual limits.');
            recommendations.push('Experiment with adaptive mode for progressively harder trials.');
        }

        recommendations.push('Multiple experiments will help you understand your attention span better.');
        recommendations.push('Learning gains indicate you can improve with practice and familiarity.');

        return recommendations;
    }
}

// Global insights calculator
const insightsCalculator = new InsightsCalculator();
