# Premium Edition Integration Guide

## Overview

The Tachistoscope Psychology Lab premium edition has been fully integrated with advanced features including:
- Modern glassmorphic UI design
- Real-time performance analytics with multi-axis charts
- Intelligent insights engine
- Comprehensive data export (Excel, PDF, CSV, JSON)
- Dark/light theme system
- Psychology theory content
- Student information persistence

## Quick Start

### 1. Deploy the Premium Interface

Replace the basic interface with the premium version:

```bash
cd /home/ram/Desktop/Tachistoscope
cp index-premium.html index.html
```

Or configure your web server to serve `index-premium.html` as the index.

### 2. Start the Server

```bash
python3 run.py
```

Then open: `http://localhost:8000`

## Architecture

### Core Modules

**experiment.js** - Experiment control logic
- Manages workflow: welcome → config → lab → response → results → summary
- Coordinates with premium UI components
- Handles adaptive difficulty (if enabled)
- Triggers chart rendering and insight generation

**premium-ui.js** - Enhanced interface controller
- Theme switching (dark/light mode with persistence)
- Student information management
- Chart rendering (performance line chart, accuracy pie chart)
- Insight generation and display
- Progress bar tracking
- Export button setup

**calculator.js** - Intelligent insights engine
- Analyzes performance level (Exceptional, Strong, Average, Below Average, Challenging)
- Evaluates attention span quality
- Detects learning patterns
- Analyzes stimulus type performance
- Categorizes reaction times
- Measures consistency and attention stability
- Generates personalized recommendations

**export.js** - Multi-format export system
- Excel: 3-sheet workbook (Summary, Trial Details, Statistics)
- PDF: Professional formatted report with auto-conclusion
- CSV: Trial-by-trial data for analysis
- JSON: Complete results with metadata
- Auto-generates intelligent conclusions based on performance

### Supporting Modules

**data.js** - Results data management
- Stores trial data in localStorage
- Exports results in standardized format
- Calculates summary statistics

**ui.js** - Basic UI management
- Screen switching
- Form input handling
- Basic event listeners

**scene.js** - 3D visualization (Three.js)
- Laboratory environment rendering
- Tachistoscope device 3D model

**tachistoscope.js** - Stimulus presentation
- Generates stimuli (letters, numbers, shapes, words, mixed)
- Controls exposure duration
- Manages stimulus display timing

## Feature Descriptions

### Results Screen

When an experiment completes, users see:

1. **Summary Cards** (4 metrics)
   - Overall Accuracy: % of correct responses
   - Average Span: Mean number of items recalled
   - Average Reaction Time: Mean response latency
   - Best Span: Maximum items recalled in single trial

2. **Performance Chart**
   - Line chart with dual Y-axes
   - Left axis: Accuracy percentage (0-100%)
   - Right axis: Reaction time (in ×100ms)
   - Shows trial-by-trial performance trends

3. **Accuracy Distribution**
   - Doughnut chart
   - Green: Correct responses
   - Red: Incorrect responses
   - Shows accuracy breakdown visually

4. **Trial-by-Trial Details**
   - Table with columns: Trial #, Stimulus, User Response, Accuracy, Reaction Time, Status
   - Allows detailed review of each trial

5. **Smart Insights** (NEW)
   - 6+ insight categories generated automatically:
     - Performance level assessment
     - Attention span evaluation
     - Learning pattern detection
     - Stimulus-type sensitivity analysis
     - Reaction time categorization
     - Consistency measurement
   - Each insight includes icon, title, and explanation

6. **Psychology Theory & Conclusion** (NEW)
   - Auto-generated conclusion about performance
   - Comprehensive background on span of attention
   - Key concepts and practical applications
   - Factors affecting attention span

7. **Export Options**
   - PDF Report: Professional formatted document
   - Excel: Multi-sheet workbook with statistics
   - CSV: Data for external analysis
   - JSON: Raw results with metadata
   - Print: Browser print dialog

### Summary Screen

After viewing results, users can proceed to a learning summary that shows:

1. **Results Statistics**
   - Average span (number of items)
   - Learning gain (percentage improvement)
   - Experiment mode (Standard or Adaptive)

2. **Key Findings** (Insights)
   - Same insights from results screen
   - Provides context for learning progress

3. **Scientific Context**
   - Educational information about span of attention
   - "Miller's magical number" (5-9 items)
   - Factors affecting span (exposure duration, complexity, attention, familiarity)

## CSS Design System

### Colors
- **Primary**: `#0f3460` (Dark blue)
- **Secondary**: `#1e5a96` (Medium blue)
- **Accent Purple**: `#7c3aed` (Purple)
- **Accent Cyan**: `#06b6d4` (Cyan)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Orange)
- **Info**: `#3b82f6` (Blue)

### Effects
- **Glassmorphism**: 10px blur, 5-15% transparency
- **Shadows**: Multiple levels (sm, md, lg, xl)
- **Animations**: Fade, slide, pulse, shimmer (150-350ms)
- **Transitions**: Fast (150ms), Base (250ms), Slow (350ms)

### Responsive Breakpoints
- **Desktop**: Full 2-column layouts (1024px+)
- **Tablet**: Single-column layouts (768px-1023px)
- **Mobile**: Optimized small screens (480px-767px)
- **Phone**: Very small screens (<480px)

## Data Persistence

### LocalStorage Keys

- `theme-preference`: 'dark' or 'light'
- `student-name`: User's name
- `student-id`: User's ID/number
- `num-trials`: Number of trials to run
- `all-experiments`: Array of all experiment results

### Experiment Data Structure

```javascript
{
  summary: {
    overallAccuracy: 75,           // %
    averageSpan: 5.2,              // items
    bestSpanEstimate: 7,           // items
    averageReactionTime: 1200,     // ms
    averageOrderAccuracy: 85,      // %
    learningGain: 12               // %
  },
  trials: [
    {
      trialNumber: 1,
      stimulus: "ABCDE",
      response: "ABCD",
      isCorrect: false,
      accuracy: 80,                // % match
      reactionTime: 1345,          // ms
      totalItems: 5,
      responseLength: 4,
      orderAccuracy: 100,          // %
      completeness: 80             // %
    },
    // ... more trials
  ]
}
```

## Adaptive Mode (Optional)

When "adaptive" mode is enabled, the application auto-adjusts:

- **Exposure Time**: Decreases if accuracy > 80%, increases if < 60%
- **Set Size**: Increases with success, decreases with failure
- **Difficulty Progression**: Dynamically customized learning curve

## Advanced Features

### Chart Rendering

Charts use Chart.js v3+ with custom styling:

```javascript
// Performance chart (dual-axis line chart)
premiumUI.createPerformanceChart(trials);

// Accuracy distribution (doughnut chart)
premiumUI.createAccuracyPieChart(trials);
```

### Insights Generation

```javascript
insightsCalculator.setResults(results);
const insights = insightsCalculator.generateInsights();

// Returns array like:
[
  {
    icon: '⭐',
    title: 'Exceptional Performance',
    text: 'Outstanding accuracy of 90%...'
  },
  // ... more insights
]
```

### Export System

```javascript
exportManager.exportToExcel(results);    // .xlsx file
exportManager.exportToPDF(results);      // .pdf file
exportManager.exportToCSV(results);      // .csv file
exportManager.exportToJSON(results);     // .json file
exportManager.generateConclusion(results); // Auto-generated text
```

## Troubleshooting

### Charts Not Appearing

1. Check browser console for errors
2. Verify Chart.js library is loaded
3. Ensure canvas elements have correct IDs (`#performance-chart`, `#accuracy-pie-chart`)
4. Confirm experimentData has been populated with trials

### Insights Not Showing

1. Verify insightsCalculator module is loaded
2. Check that `setResults()` is called before `generateInsights()`
3. Ensure insights-container element exists in HTML
4. Look for console errors about missing DOM elements

### Theme Switching Not Working

1. Check localStorage is enabled in browser
2. Verify theme-toggle button has correct ID
3. Ensure CSS has `[data-theme="dark"]` and `[data-theme="light"]` selectors
4. Clear browser cache and reload

### Export Not Working

1. Verify export.js is loaded before export.js is called
2. Check that results data is properly populated
3. Ensure browser allows downloads
4. For Excel: verify XLSX library is loaded
5. For PDF: verify html2pdf library is loaded

## Browser Requirements

- Modern browser with ES6 support
- WebGL (optional - falls back to Canvas 2D)
- localStorage enabled
- Third-party libraries:
  - Three.js (3D graphics)
  - Chart.js v3+ (charting)
  - XLSX (Excel export)
  - html2pdf (PDF export)

## Future Enhancements

Potential additions for future versions:

1. **Teacher Dashboard**
   - Student comparison charts
   - Class-wide analytics
   - Performance trending

2. **Advanced Exports**
   - DOCX reports with embedded charts
   - PPTX presentations
   - Interactive HTML dashboards

3. **Mobile App**
   - PWA version for mobile devices
   - Touch-optimized interface
   - Offline data sync

4. **Video Content**
   - Psychology theory videos
   - Technique tutorial videos
   - Results interpretation guides

5. **Gamification** (Optional)
   - Achievement badges
   - Leaderboards
   - Progress challenges
   - Streak tracking

## File Structure

```
Tachistoscope/
├── css/
│   ├── theme.css           # Design system foundation
│   ├── premium-layout.css  # Modern responsive layouts
│   └── lab.css             # Lab-specific styling
├── js/
│   ├── data.js            # Results data management
│   ├── scene.js           # 3D visualization
│   ├── tachistoscope.js   # Stimulus presentation
│   ├── experiment.js      # Experiment control
│   ├── ui.js              # Basic UI management
│   ├── export.js          # Multi-format export
│   ├── calculator.js      # Insights engine
│   ├── premium-ui.js      # Premium UI controller
│   └── main-premium.js    # Entry point
├── index-premium.html      # Main interface
├── run.py                 # Development server
└── README.md              # Documentation
```

## Support & Feedback

For issues or feature requests:
1. Check the PREMIUM_REDESIGN.md for feature documentation
2. Review console logs for error messages
3. Verify all required libraries are loaded
4. Check that experiment data is properly populated

## Version History

- **v2.0** - Premium redesign complete with advanced analytics
- **v1.5** - Adaptive difficulty mode added
- **v1.0** - Initial 3D laboratory implementation
