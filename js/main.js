/**
 * Main Application Entry Point
 * Initializes all modules and starts the application
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing 3D Psychology Virtual Lab - Tachistoscope Experiment...');

    // Initialize all modules
    initializeUI();
    initializeExperiment();

    // Setup responsive behavior
    setupResponsiveDesign();

    // Log initialization complete
    console.log('Application initialized successfully!');
});

/**
 * Setup responsive design features
 */
function setupResponsiveDesign() {
    // Handle window resize for responsive layout
    window.addEventListener('resize', () => {
        // Update scene dimensions if needed
        if (labScene && labScene.onWindowResize) {
            labScene.onWindowResize();
        }
    });

    // Handle orientation change for mobile devices
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (labScene && labScene.onWindowResize) {
                labScene.onWindowResize();
            }
        }, 100);
    });
}

/**
 * Cleanup function for page unload
 */
window.addEventListener('unload', () => {
    // Clean up resources
    if (labScene) {
        labScene.dispose();
    }
    if (tachistoscope) {
        tachistoscope.destroy();
    }
    console.log('Resources cleaned up.');
});

/**
 * Handle errors gracefully
 */
window.addEventListener('error', (event) => {
    console.error('Error occurred:', event.error);
    if (uiManager) {
        uiManager.showNotification('An error occurred. Please refresh the page.', 'error');
    }
});

/**
 * Prevent accidental navigation
 */
window.addEventListener('beforeunload', (event) => {
    if (experiment && experiment.isRunning) {
        event.preventDefault();
        event.returnValue = '';
    }
});

/**
 * Check browser capabilities
 */
function checkBrowserCapabilities() {
    const capabilities = {
        webgl: !!document.createElement('canvas').getContext('webgl'),
        localStorage: typeof localStorage !== 'undefined',
        canvas: !!document.createElement('canvas').getContext('2d')
    };

    console.log('Browser Capabilities:', capabilities);

    if (!capabilities.canvas) {
        alert('Your browser does not support Canvas. Some features may not work properly.');
    }

    return capabilities;
}

// Check capabilities on load
checkBrowserCapabilities();

/**
 * Application version
 */
const APP_VERSION = '1.0.0';
const APP_NAME = '3D Psychology Virtual Lab - Tachistoscope Experiment';

console.log(`${APP_NAME} v${APP_VERSION}`);
console.log('Built with WebGL/Three.js and Canvas 2D');
