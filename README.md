<!-- markdownlint-disable -->

# Tachistoscope Pro - Attention Testing Platform

A fully interactive, immersive 3D virtual laboratory for performing psychology experiments focused on measuring the **Span of Attention** using a digital tachistoscope.

## Commercial Mode

This repo now includes a productized experience with:
- persistent session history
- institution and cohort metadata
- business-facing dashboard sections
- pricing/offer positioning
- installable offline-ready PWA support

See [PRODUCT_PLAYBOOK.md](PRODUCT_PLAYBOOK.md) for a simple monetization path and launch checklist.

## Features

### 🎓 Educational Components
- **Comprehensive Theory Section**: Learn about attention span psychology
- **Guided Instructions**: Step-by-step experiment procedure
- **Interactive Stimulus Presentation**: Brief, timed visual stimulus display
- **Real-time Feedback**: Immediate response evaluation
- **Detailed Analytics**: Performance charts and statistics
- **Learning Summary**: Educational insights and viva questions

### 🔬 Experiment Features
- **Configurable Parameters**:
  - Exposure time (0.1s to 1.0s)
  - Number of trials (3-20)
  - Multiple stimulus types (letters, numbers, shapes, words, mixed)

- **Stimulus Types**:
  - Letters (A-Z)
  - Numbers (0-9)
  - Shapes (▲ ● ■ ★ ◆ ▼ ○)
  - Words (Common English words)
  - Mixed (Combination of all types)

### 📊 Results & Analysis
- Overall accuracy percentage
- Average span of attention
- Average reaction time
- Per-trial detailed statistics
- Performance trend chart
- CSV export capability
- Print-friendly results

### 🌐 3D Environment
- Realistic digital laboratory with:
  - Professional experiment desk
  - Digital tachistoscope device
  - Participant chair
  - Wall-mounted clock
  - Shelves with reference books
  - Advanced 3D graphics with shadows and lighting
  - Smooth interactive camera

### 💻 User Interface
- Clean, intuitive dashboard
- Responsive design for desktop and tablet
- Professional academic appearance
- Smooth animations and transitions
- Dark mode for easy reading
- Accessibility-friendly design

## System Requirements

- **Browser**: Modern web browser with WebGL support
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+
- **RAM**: Minimum 512MB
- **Processor**: Dual-core or better
- **Display**: 1024x768 or higher resolution
- **Network**: No internet connection required (can run locally)

## Installation & Setup

### Quick Start (Recommended)

1. **Download/Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tachistoscope.git
   cd Tachistoscope
   ```

2. **Download Required Libraries**
   
   The application requires two external libraries (Three.js and Chart.js). You can:
   
   **Option A: Using the provided setup script**
   ```bash
   bash setup.sh
   ```
   
   **Option B: Manual Download**
   - Download [Three.js](https://threejs.org/build/three.min.js) and save to `lib/three.min.js`
   - Download [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) and save to `lib/chart.min.js`

3. **Run the Application**
   
   **Using Python (Python 3):**
   ```bash
   python -m http.server 8000
   ```
   Then open browser to: `http://localhost:8000`
   
   **Using Node.js (with http-server):**
   ```bash
   npx http-server
   ```
   Then open browser to: `http://localhost:8080`
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```
   Then open browser to: `http://localhost:8000`
   
   **Direct File Opening:**
   Simply open `index.html` in your browser (some features may be limited)

### Docker Setup (Optional)

```bash
docker build -t tachistoscope .
docker run -p 8000:8000 tachistoscope
# Open http://localhost:8000
```

## Usage Guide

### Starting an Experiment

1. **Welcome Screen**: Read the introduction and click "Start Experiment"

2. **Configuration Screen**: 
   - Select exposure time
   - Choose number of trials
   - Select stimulus type
   - Click "Enter Lab"

3. **Lab Environment**:
   - Wait for the 3D lab to load
   - The tachistoscope display will be visible
   - Follow on-screen prompts

4. **Stimulus Presentation**:
   - Items appear briefly on the tachistoscope screen
   - Stimulus automatically disappears after the set duration
   - Enter your response when the response screen appears

5. **Response Input**:
   - Type items you observed (space-separated)
   - Press Enter or click "Submit Response"
   - Option to skip trial if needed

6. **Results & Analysis**:
   - View detailed results with accuracy percentage
   - See performance chart
   - Access trial-by-trial breakdown

7. **Learning Summary**:
   - Understand what the results mean
   - Learn about attention span psychology
   - Discuss viva questions

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Submit response |
| Escape | Go to welcome screen |
| F11 | Toggle fullscreen |

## File Structure

```
Tachistoscope/
├── index.html              # Main HTML file
├── README.md              # This file
├── setup.sh               # Setup script for libraries
├── docker-compose.yml     # Docker configuration (optional)
├── css/
│   ├── styles.css         # Main styles
│   ├── lab.css            # Lab-specific styles
│   └── ui.css             # UI component styles
├── js/
│   ├── main.js            # Application entry point
│   ├── data.js            # Data management
│   ├── scene.js           # 3D scene setup
│   ├── tachistoscope.js   # Device logic
│   ├── experiment.js      # Experiment flow
│   └── ui.js              # UI utilities
├── lib/
│   ├── three.min.js       # Three.js library (download)
│   └── chart.min.js       # Chart.js library (download)
└── assets/                # For future textures/models
```

## Module Documentation

### data.js
Manages experiment data, calculations, and storage.

**Key Classes:**
- `ExperimentData`: Main data manager
  - `setConfig()`: Configure experiment parameters
  - `addTrial()`: Record trial results
  - `getOverallAccuracy()`: Get aggregate accuracy
  - `exportResults()`: Export data as JSON
  - `saveToLocalStorage()`: Persist results

### scene.js
Creates and manages the 3D laboratory environment using Three.js.

**Key Classes:**
- `LabScene`: 3D environment manager
  - `createLabEnvironment()`: Build lab room
  - `createLighting()`: Set up lighting
  - `createTachistoscope()`: Build device
  - `createFurniture()`: Add furniture

### tachistoscope.js
Controls the tachistoscope device and stimulus presentation.

**Key Classes:**
- `Tachistoscope`: Device controller
  - `generateStimulus()`: Create random stimulus
  - `presentStimulus()`: Display stimulus briefly
  - `clearDisplay()`: Clear the display

### experiment.js
Main experiment workflow and logic.

**Key Classes:**
- `TachistoscopeExperiment`: Experiment controller
  - `startExperiment()`: Begin experiment
  - `runTrial()`: Execute single trial
  - `submitResponse()`: Record response
  - `showResults()`: Display results

### ui.js
User interface utilities and helper functions.

**Key Classes:**
- `UIManager`: UI event manager
  - `showNotification()`: Display message
  - `createLoadingOverlay()`: Show loading state

**Utility Functions:**
- `exportToCSV()`: Export results as CSV
- `printResults()`: Print results
- `isMobileDevice()`: Detect mobile
- `debounce()`: Debounce function calls

## Technical Details

### Technologies Used
- **3D Graphics**: Three.js (WebGL)
- **Canvas**: HTML5 Canvas 2D (fallback)
- **Data Visualization**: Chart.js
- **Styling**: CSS3 with animations
- **Storage**: Browser localStorage
- **JavaScript**: ES6+ (vanilla JavaScript, no frameworks)

### Browser Compatibility
| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | WebGL + all features |
| Firefox | ✅ Full | WebGL + all features |
| Safari | ✅ Full | WebGL + all features |
| Edge | ✅ Full | WebGL + all features |
| IE 11 | ❌ Not supported | No WebGL |

### Performance
- Optimized for laptops and desktops
- Smooth 60 FPS 3D rendering
- Minimal memory footprint
- Efficient DOM updates
- Debounced event handlers

## Data Privacy

- **No Server Required**: Runs entirely on client-side
- **No Data Transmission**: Results never leave your device
- **Local Storage**: Results saved in browser's localStorage
- **No Tracking**: No analytics or tracking code
- **No Cookies**: No third-party cookies

## Customization

### Modify Stimulus
Edit in `js/tachistoscope.js`:
```javascript
this.stimulusLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
this.stimulusWords = ['CAT', 'DOG', 'SUN', ...];
```

### Change Colors
Edit in `css/styles.css` and `css/ui.css`:
```css
/* Primary color */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Default Settings
Edit in `js/experiment.js`:
```javascript
this.config = {
    exposureTime: 0.3,    // Default exposure time
    numTrials: 10,        // Default number of trials
    stimulusType: 'letters'
};
```

## Troubleshooting

### Black/Empty 3D Canvas
- Check if WebGL is enabled in your browser
- Try a different browser
- Ensure JavaScript is enabled
- Check browser console for errors (F12)

### Library Files Missing
Error: "THREE is not defined"
- Download `three.min.js` to `lib/` folder
- Run `bash setup.sh` to auto-download

Error: "Chart is not defined"
- Download `chart.min.js` to `lib/` folder
- Run `bash setup.sh` to auto-download

### Results Not Saving
- Check if localStorage is enabled
- Clear browser cache and reload
- Check available disk space
- Try incognito/private mode

### Input Not Responding
- Ensure cursor is in input field
- Check for browser extensions interfering
- Refresh page and try again
- Try different browser

## Frequently Asked Questions

**Q: Can I run this without internet?**
A: Yes! The application runs entirely offline. Internet is only needed to download the libraries initially.

**Q: Can I modify the experiments for my research?**
A: Yes! The code is open source and customizable. Modify stimulus types, timing, or analysis.

**Q: Where are my results saved?**
A: Results are saved in your browser's localStorage. They persist until you clear browser data.

**Q: Can I export results?**
A: Yes! Results can be exported as CSV or printed from the results page.

**Q: Is this accurate for actual psychology research?**
A: This is an educational tool. For research purposes, use validated laboratory software. However, the methodology is sound for teaching purposes.

**Q: How can I add more stimulus types?**
A: Edit the `Tachistoscope` class in `js/tachistoscope.js` and add new properties and generation methods.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Educational Use

This virtual lab is designed for:
- **Psychology Students**: Learn about attention and perception
- **Educators**: Teach experimental methodology
- **Researchers**: Baseline for further research
- **Self-Learners**: Explore psychology independently

## Citation

If you use this in research or publication, please cite as:
```
Author. (2024). 3D Psychology Virtual Lab - Span of Attention using Tachistoscope.
Retrieved from https://github.com/yourusername/tachistoscope
```

## Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@example.com
- Documentation: See README sections above

## Disclaimer

This is an educational tool. Results from this application should not be used for clinical or diagnostic purposes. For official psychology assessments, consult a licensed psychologist.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development

Enjoy learning psychology in an immersive 3D environment!
