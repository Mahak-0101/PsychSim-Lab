/**
 * Tachistoscope Device Module
 * Handles stimulus generation and presentation
 */

class Tachistoscope {
    constructor() {
        this.currentStimulus = null;
        this.isPresenting = false;
        this.displayElement = null;
        this.stimulusLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.stimulusNumbers = '0123456789';
        this.stimulusShapes = ['▲', '●', '■', '★', '◆', '▼', '●', '○'];
        this.stimulusWords = ['CAT', 'DOG', 'SUN', 'MOON', 'TREE', 'BIRD', 'FISH', 'STAR', 'BOOK', 'DOOR'];
    }

    generateStimulus(type, minCount = 3, maxCount = 8) {
        let stimulus = [];
        const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

        switch (type) {
            case 'letters':
                stimulus = this.generateRandomItems(this.stimulusLetters, count);
                break;
            case 'numbers':
                stimulus = this.generateRandomItems(this.stimulusNumbers, count);
                break;
            case 'shapes':
                stimulus = this.generateRandomItems(this.stimulusShapes, count);
                break;
            case 'words':
                stimulus = this.generateRandomItems(this.stimulusWords, count);
                break;
            case 'mixed':
                stimulus = this.generateMixedStimulus(count);
                break;
            default:
                stimulus = this.generateRandomItems(this.stimulusLetters, count);
        }

        this.currentStimulus = stimulus.join(' ');
        return this.currentStimulus;
    }

    generateRandomItems(source, count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * source.length);
            result.push(source[randomIndex]);
        }
        return result;
    }

    generateMixedStimulus(count) {
        const result = [];
        const types = [this.stimulusLetters, this.stimulusNumbers, this.stimulusShapes];

        for (let i = 0; i < count; i++) {
            const typeIndex = Math.floor(Math.random() * types.length);
            const items = types[typeIndex];
            const randomIndex = Math.floor(Math.random() * items.length);
            result.push(items[randomIndex]);
        }
        return result;
    }

    presentStimulus(stimulus, duration = 0.3) {
        return new Promise((resolve) => {
            this.isPresenting = true;
            this.currentStimulus = stimulus;

            // Show stimulus
            const displayElement = this.getDisplayElement();
            if (displayElement) {
                displayElement.textContent = stimulus;
                displayElement.style.display = 'flex';
                displayElement.style.opacity = '1';
            }

            // Hide after specified duration
            setTimeout(() => {
                if (displayElement) {
                    displayElement.style.opacity = '0';
                    setTimeout(() => {
                        displayElement.style.display = 'none';
                        this.isPresenting = false;
                        resolve();
                    }, 200);
                } else {
                    this.isPresenting = false;
                    resolve();
                }
            }, duration * 1000);
        });
    }

    getDisplayElement() {
        if (!this.displayElement) {
            this.displayElement = document.createElement('div');
            this.displayElement.className = 'tachistoscope-display stimulus-text';
            this.displayElement.id = 'stimulus-display';
            this.displayElement.style.display = 'none';
            this.displayElement.style.opacity = '0';
            this.displayElement.style.transition = 'opacity 0.2s ease';
            document.body.appendChild(this.displayElement);
        }
        return this.displayElement;
    }

    getCurrentStimulus() {
        return this.currentStimulus;
    }

    clearDisplay() {
        const displayElement = this.getDisplayElement();
        if (displayElement) {
            displayElement.style.display = 'none';
            displayElement.textContent = '';
        }
    }

    destroy() {
        if (this.displayElement && this.displayElement.parentNode) {
            this.displayElement.parentNode.removeChild(this.displayElement);
            this.displayElement = null;
        }
    }
}

// Global tachistoscope instance
let tachistoscope = null;

function initializeTachistoscope() {
    if (!tachistoscope) {
        tachistoscope = new Tachistoscope();
    }
    return tachistoscope;
}
