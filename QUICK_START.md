# Quick Start Guide

Get the Tachistoscope Virtual Lab running in 5 minutes!

## Option 1: Python (Easiest)

### Requirements
- Python 3.6+ (usually pre-installed on macOS/Linux)

### Steps

1. **Open Terminal** in the Tachistoscope folder

2. **Run Setup** (once):
   ```bash
   bash setup.sh
   ```
   This downloads required JavaScript libraries.

3. **Start Server**:
   ```bash
   python3 run.py
   ```

4. **Open Browser**:
   Visit: `http://localhost:8000`

5. **Done!** 🎉

## Option 2: Node.js (If you have Node.js)

### Requirements
- Node.js 12+ installed

### Steps

1. **Open Terminal** in the Tachistoscope folder

2. **Install Dependencies** (once):
   ```bash
   npm install
   npm run setup
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

4. **Browser opens automatically** 🎉

## Option 3: Docker (If you have Docker)

### Requirements
- Docker installed

### Steps

1. **Run with Docker Compose**:
   ```bash
   docker-compose up
   ```

2. **Open Browser**:
   Visit: `http://localhost:8000`

3. **Stop Server**:
   ```bash
   docker-compose down
   ```

## Option 4: Manual (No Internet Required After Setup)

1. **Download Libraries manually**:
   - Get `three.min.js` from: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
   - Get `chart.min.js` from: https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
   - Place both in the `lib/` folder

2. **For macOS/Linux** - Use PHP:
   ```bash
   php -S localhost:8000
   ```

3. **For Windows** - Use Node:
   ```bash
   npx http-server
   ```

4. **Open Browser**:
   Visit the local server URL shown in terminal

## Option 5: Direct File (Simplest but Limited)

1. **Just double-click** `index.html` in your file explorer

⚠️ Note: Some features may be limited. Better to use one of the options above.

## 🎯 Using the Application

### First Run
1. Click "Start Experiment"
2. Configure your test (exposure time, number of trials, stimulus type)
3. Click "Enter Lab"
4. Follow the on-screen prompts

### What Happens
1. **Stimulus appears** on screen briefly
2. **Type what you saw** in the response box
3. **See your results** after each trial
4. **Analyze performance** when complete

### After Completing Experiment
- View detailed results
- See performance chart
- Read learning summary
- Print or export results (in full version)

## 🆘 Troubleshooting

### "Cannot find module" or "THREE not defined"
- The JavaScript libraries didn't download
- Run: `bash setup.sh`
- If that doesn't work, manually download from URLs above

### Black 3D Canvas
- 3D graphics not supported
- Try different browser (Chrome recommended)
- Check if WebGL is enabled (Settings → Advanced)

### Port 8000 Already in Use
- Use different port:
  ```bash
  python3 run.py 8001
  ```
- Or stop whatever is using port 8000

### "Permission denied" on setup.sh
```bash
chmod +x setup.sh
bash setup.sh
```

### Keyboard Input Not Working
- Make sure cursor is in the input box
- Try clicking in the text field
- Check if browser extensions are interfering (try incognito mode)

## 📚 Next Steps

1. **Run the experiment** at least once
2. **Check different settings** - try different exposure times
3. **Read the learning summary** to understand the psychology
4. **Discuss with classmates** - compare your results
5. **Try different stimulus types** to see how they affect your span

## 🎓 For Teachers

Print this guide for your students. You can also:
- Host it on your school server
- Share via learning management system (Google Classroom, Canvas, etc.)
- Deploy with Docker for consistent environment

## 💡 Tips

- **Best results**: Use Chrome or Firefox browser
- **Clear focus area**: Close distracting tabs/windows
- **Take breaks**: Between experiments, rest your eyes
- **Try multiple times**: Practice can improve your attention span slightly

## 🚀 Ready to Start?

```bash
# One command to rule them all (Python 3):
python3 run.py

# Then open http://localhost:8000 in your browser
```

Enjoy your psychology experiment! 🧠✨
