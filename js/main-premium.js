/**
 * Main Application Entry Point - Premium Edition
 * Initializes all modules and sets up the application
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Tachistoscope Pro');
    console.log('Initializing...');

    // Initialize modules  
    initializeUI();
    initializeExperiment();

    // Export manager integration
    if (typeof exportManager !== 'undefined') {
        console.log('✓ Export manager ready');
    }

    // Insights calculator integration
    if (typeof insightsCalculator !== 'undefined') {
        console.log('✓ Insights calculator ready');
    }

    // Premium UI integration
    if (typeof premiumUI !== 'undefined') {
        console.log('✓ Premium UI controller ready');
    }

    // Check browser capabilities
    checkBrowserCapabilities();
    registerProductShell();

    // Log startup complete
    console.log('✓ Application initialized successfully!');
});

function checkBrowserCapabilities() {
    const capabilities = {
        webgl: (() => {
            try {
                return !!document.createElement('canvas').getContext('webgl') || 
                       !!document.createElement('canvas').getContext('webgl2');
            } catch { return false; }
        })(),
        localStorage: (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch { return false; }
        })(),
        canvas: (() => {
            return !!document.createElement('canvas').getContext('2d');
        })()
    };

    console.log('Browser capabilities:', capabilities);

    if (!capabilities.localStorage) {
        console.warn('⚠️ localStorage not available - data persistence disabled');
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

function registerProductShell() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', async () => {
        try {
            await navigator.serviceWorker.register('./sw.js');
            console.log('✓ Offline shell ready');
        } catch (error) {
            console.warn('Service worker registration skipped:', error);
        }
    });
}
