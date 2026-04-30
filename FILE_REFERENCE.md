# Project File Reference

Quick reference guide to all files and directories in the Tachistoscope project.

## 📁 Directory Structure

```
Tachistoscope/
│
├── 📄 Core Application Files
│   ├── index.html                    - Main application entry point
│   ├── run.py                        - Simple Python web server
│   └── package.json                  - Node.js/npm configuration
│
├── 🎨 CSS Stylesheets (css/)
│   ├── styles.css                    - Main application styles
│   ├── lab.css                       - 3D lab environment styles
│   └── ui.css                        - UI components and utilities
│
├── 💻 JavaScript Modules (js/)
│   ├── main.js                       - Application initialization
│   ├── data.js                       - Data management & analytics
│   ├── scene.js                      - 3D environment (Three.js)
│   ├── tachistoscope.js              - Device logic & stimulus
│   ├── experiment.js                 - Experiment workflow
│   └── ui.js                         - UI utilities & helpers
│
├── 📚 Documentation Files
│   ├── README.md                     - Complete documentation
│   ├── QUICK_START.md                - Fast setup guide
│   ├── EDUCATIONAL_GUIDE.md          - Learning materials
│   ├── LICENSE                       - MIT License
│   └── FILE_REFERENCE.md             - This file
│
├── 🔧 Configuration & Setup
│   ├── setup.sh                      - Bash setup script
│   ├── Dockerfile                    - Docker configuration
│   ├── docker-compose.yml            - Docker Compose config
│   └── .gitignore                    - Git ignore rules
│
├── 📦 External Libraries (lib/)
│   ├── three.min.js                  - 3D graphics (Three.js)
│   └── chart.min.js                  - Data visualization (Chart.js)
│   
└── 🎨 Assets (assets/)
    └── (Reserved for future textures, models, sounds)
```

## 📄 File Descriptions

### Core Application Files

#### `index.html`
- **Purpose**: Main HTML structure and layout
- **Contains**: All screen definitions, form elements, UI components
- **Size**: ~360 lines
- **Entry Point**: Always open this file in browser

#### `run.py`
- **Purpose**: Simple Python HTTP server
- **Usage**: `python3 run.py`
- **Features**: CORS support, error handling, library checking
- **Port**: 8000 (configurable)

#### `package.json`
- **Purpose**: Node.js project metadata
- **Usage**: `npm install`, `npm start`
- **Scripts**: start, dev, server, setup
- **Dependencies**: http-server, three, chart.js

### CSS Stylesheets

#### `css/styles.css`
- **Components**: General layout, screens, form elements
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Size**: ~600 lines
- **Key Classes**: `.screen`, `.btn`, `.form-group`

#### `css/lab.css`
- **Components**: 3D lab environment, tachistoscope, controls
- **Features**: Animations, glowing effects, responsive grid
- **Size**: ~400 lines
- **Key Classes**: `.lab-screen`, `.device-frame`, `.control-panel`

#### `css/ui.css`
- **Components**: Buttons, cards, alerts, tooltips, tables
- **Utilities**: Flexbox, grid, text, spacing, shadows
- **Size**: ~500 lines
- **Responsive**: Mobile-first design approach

### JavaScript Modules

#### `js/main.js`
- **Purpose**: Application initialization and setup
- **Functions**: Module initialization, event listeners, error handling
- **Size**: ~80 lines
- **Executes When**: Page loads (DOMContentLoaded)

#### `js/data.js`
- **Purpose**: Experiment data storage and analysis
- **Class**: `ExperimentData`
- **Methods**: 
  - `addTrial()` - Record trial results
  - `getOverallAccuracy()` - Calculate accuracy
  - `exportResults()` - Export data as JSON
  - `saveToLocalStorage()` - Persist data
- **Size**: ~140 lines
- **Data Structure**: Trials array with stimulus, response, accuracy, timing

#### `js/scene.js`
- **Purpose**: 3D laboratory environment using Three.js
- **Class**: `LabScene`
- **Features**: 
  - Floor, walls, ceiling
  - Lighting system (ambient, directional, spot)
  - Tachistoscope device model
  - Furniture (desk, chair, shelves)
  - Animation loop
- **Size**: ~300 lines
- **Fallback**: Canvas 2D if WebGL unavailable

#### `js/tachistoscope.js`
- **Purpose**: Stimulus generation and presentation
- **Class**: `Tachistoscope`
- **Methods**:
  - `generateStimulus()` - Create random stimulus
  - `presentStimulus()` - Display with timing
  - `clearDisplay()` - Remove from screen
- **Stimulus Types**: Letters, numbers, shapes, words, mixed
- **Size**: ~120 lines

#### `js/experiment.js`
- **Purpose**: Main experiment workflow and control
- **Class**: `TachistoscopeExperiment`
- **Status States**: welcome, config, lab, response, results, summary
- **Key Methods**:
  - `startExperiment()` - Begin new experiment
  - `runTrial()` - Execute single trial
  - `submitResponse()` - Process user response
  - `showResults()` - Display results screen
- **Size**: ~420 lines

#### `js/ui.js`
- **Purpose**: UI management and utility functions
- **Class**: `UIManager`
- **Utilities**:
  - `exportToCSV()` - Export results
  - `printResults()` - Print-friendly output
  - `debounce()` - Debounce function calls
  - `isMobileDevice()` - Detect mobile
- **Size**: ~350 lines

### Documentation Files

#### `README.md`
- **Audience**: Everyone
- **Contents**: Features, installation, usage, troubleshooting, FAQ
- **Sections**: 
  - System requirements
  - Installation guides
  - Usage instructions
  - Module documentation
  - Customization options
  - Support & contact
- **Size**: ~450 lines

#### `QUICK_START.md`
- **Audience**: New users who want fast setup
- **Contents**: 
  - Quick installation options
  - Troubleshooting basics
  - Using the application
  - Next steps
- **Size**: ~150 lines

#### `EDUCATIONAL_GUIDE.md`
- **Audience**: Students and educators
- **Contents**: 
  - Psychology foundations
  - Historical background
  - Experimental procedure
  - Expected results
  - Discussion topics
  - Learning objectives
  - Viva questions
- **Size**: ~500 lines

#### `LICENSE`
- **Type**: MIT License
- **Permissions**: Use, modify, distribute freely
- **Terms**: Include license, no warranty
- **Size**: ~30 lines

### Configuration Files

#### `setup.sh`
- **Purpose**: Automated library download
- **Downloads**: Three.js and Chart.js
- **Method**: curl or wget
- **Fallback**: Manual download instructions
- **Size**: ~60 lines

#### `Dockerfile`
- **Purpose**: Docker container definition
- **Base Image**: Python 3.9-slim
- **Includes**: Setup script execution, library downloads
- **Port**: Exposes 8000

#### `docker-compose.yml`
- **Purpose**: Multi-container orchestration
- **Service**: tachistoscope (Python server)
- **Port Mapping**: Host 8000 → Container 8000
- **Volume**: Binds local directory for live editing

#### `.gitignore`
- **Purpose**: Exclude files from git repository
- **Ignores**: node_modules, lib files, temp files, build outputs
- **Size**: ~40 lines

## 🗂️ File Size Summary

| Category | Component | Size | Lines |
|----------|-----------|------|-------|
| HTML | index.html | ~20 KB | 360 |
| CSS | Total all | ~45 KB | 1500 |
| JavaScript | Total all | ~65 KB | 1500 |
| Docs | Total all | ~100 KB | 1500 |
| Config | Total all | ~10 KB | 200 |
| **TOTAL** | **All Files** | **~240 KB** | **~5000** |

*Note: Sizes are approximate and exclude minified libraries (Three.js ~600KB, Chart.js ~80KB)*

## 🔑 Key Technologies

| Technology | Purpose | File(s) |
|-----------|---------|---------|
| HTML5 | Structure | index.html |
| CSS3 | Styling | css/*.css |
| JavaScript ES6+ | Logic | js/*.js |
| Three.js | 3D Graphics | lib/three.min.js |
| Chart.js | Graphs | lib/chart.min.js |
| Canvas 2D | Fallback Graphics | scene.js |
| LocalStorage | Data Persistence | data.js |
| Python | Web Server | run.py |
| Docker | Containerization | Dockerfile |
| Bash/Shell | Automation | setup.sh |

## 🎯 Module Dependencies

```
main.js
├── data.js (ExperimentData)
├── scene.js (LabScene, Three.js)
├── tachistoscope.js (Tachistoscope)
├── experiment.js (TachistoscopeExperiment)
└── ui.js (UIManager)

index.html
├── css/styles.css
├── css/lab.css
├── css/ui.css
├── js/data.js
├── js/scene.js
├── js/tachistoscope.js
├── js/experiment.js
├── js/ui.js
└── js/main.js

lib/
├── three.min.js (3D graphics)
└── chart.min.js (Charting)
```

## 📝 Code Statistics

- **Total Lines of Code**: ~5000
- **JavaScript Lines**: ~1500
- **CSS Lines**: ~1500
- **Documentation**: ~1500
- **HTML/Config**: ~500
- **Comments & Whitespace**: Minimal

## 🔍 How to Find Things

### Looking for...
- **How to start the app** → `index.html` or `QUICK_START.md`
- **How to run it** → `run.py` or `setup.sh` or `QUICK_START.md`
- **Styling rules** → `css/styles.css`, `css/lab.css`, `css/ui.css`
- **Data handling** → `js/data.js`
- **3D graphics** → `js/scene.js`
- **Experiment logic** → `js/experiment.js`
- **UI interaction** → `js/ui.js`
- **Psychology info** → `EDUCATIONAL_GUIDE.md`
- **Troubleshooting** → `README.md` or `QUICK_START.md`
- **Configuration** → `package.json` or `.gitignore`

## 📚 Learning Path for Developers

1. **Start Here**: `README.md` and `QUICK_START.md`
2. **Understand Structure**: `index.html`
3. **Learn UI**: `css/` folder
4. **Understand Flow**: `js/experiment.js`
5. **Explore Features**: Other `js/` files
6. **Customize**: Edit any file to suit needs

## 🚀 Next Steps

- **To RUN**: See `QUICK_START.md`
- **To UNDERSTAND**: Read `README.md` and `EDUCATIONAL_GUIDE.md`
- **To MODIFY**: Edit any `css/` or `js/` files
- **To DEPLOY**: Use `Dockerfile` or `docker-compose.yml`
- **To CONTRIBUTE**: Check guidelines in `README.md`

---

**Last Updated**: 2024  
**Project Version**: 1.0.0  
**Total Files**: 16
