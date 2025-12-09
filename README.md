# Mines Game - Stake.bet Style Predictor 🎮

A premium hash seed-based mine game prediction application with **stake.bet inspired design** and immersive sound effects. Built with HTML, CSS, and JavaScript, featuring deterministic mine generation using cryptographic hashing for fair and transparent gameplay.

![Mines Game Preview](https://via.placeholder.com/800x400/0a0a0a/00ff88?text=Mines+Predictor+Stake.bet+Style)

## ✨ New Stake.bet Style Features

### 🎨 **Premium Dark Theme Design**
- **Neon Color Scheme**: Signature green (#00ff88) and red (#ff4757) accents
- **Glowing Effects**: Dynamic shadows and neon glows on interactive elements
- **Gradient Backgrounds**: Subtle radial gradients for depth
- **Glass Morphism**: Backdrop blur effects on cards and panels
- **Smooth Animations**: Fade-in, slide-up, and pulse effects

### 🔊 **Immersive Sound System**
- **Web Audio API**: Programmatic sound generation (no audio files needed)
- **Interactive Sounds**: Click, hover, predict, mine, safe, success, error, and reset sounds
- **Configurable Volume**: Toggle sound effects on/off
- **Contextual Audio**: Different sounds for different game states

### 🎯 **Enhanced Gameplay**
- **Auto Predict Mode**: Continuous automated predictions
- **Real-time Multiplier**: Dynamic payout calculations with 1% house edge
- **Quick Actions**: Share results, copy hash, export data
- **Game Status Indicator**: Visual feedback for game states
- **Staggered Animations**: Sequential reveal effects for better UX

## 🎮 Core Features

### 🔒 **Transparency & Fairness**
- **Hash Seed Input**: Enter any hash string for deterministic predictions
- **SHA-256 + LCG Algorithm**: Combines cryptographic hashing with linear congruential generator
- **Client-Side Processing**: All calculations performed locally for complete transparency
- **Reproducible Results**: Same hash always produces identical mine positions

### 📊 **Advanced Statistics**
- **Prediction Analysis**: Hash verification and entropy calculation
- **Real-time Multiplier**: Calculated based on mine density and win probability
- **Game Statistics**: Total predictions, mine density, win probability tracking
- **Expected Payout**: Dynamic multiplier with house edge consideration

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Stake.bet Aesthetics**: Premium gambling platform styling
- **Accessibility**: High contrast colors and keyboard navigation
- **Professional Layout**: Dashboard-style interface with organized panels

## 🚀 Quick Start

### **Basic Usage**
1. Open `index.html` in a modern web browser
2. Enter a hash seed or use the auto-generated one
3. Select mine amount (1-24 mines)
4. Click "PREDICT MINES" to see deterministic results
5. Click cells to reveal them manually (demo feature)

### **Advanced Features**
- **Auto Mode**: Click "AUTO PREDICT" for continuous predictions
- **Sound Control**: Toggle audio effects using the sound controls
- **Quick Actions**: Share results, copy hash, or export prediction data

## 🛠️ Technical Implementation

### **Hash-Based Prediction Algorithm**

```javascript
// Core algorithm: SHA-256 + Seeded RNG
const seed = createSeedFromHash(hashString);
const random = seededRandom(seed);
const minePosition = Math.floor(random() * totalCells);
```

### **Sound Generation System**

```javascript
// Web Audio API programmatic sound creation
async createPredictSound() {
    const buffer = this.audioContext.createBuffer(1, duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
        const t = i / this.audioContext.sampleRate;
        const freq = 200 + (t * 400); // Frequency sweep
        data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5) * 0.4;
    }
    
    return buffer;
}
```

### **Multiplier Calculation**

```javascript
// Fair multiplier with 1% house edge
const winProbability = safeCells / totalCells;
const fairMultiplier = 1 / winProbability;
this.currentMultiplier = fairMultiplier * (1 - houseEdge);
```

## 📁 File Structure

```
├── index.html          # Main application structure
├── styles.css          # Stake.bet inspired dark theme styling
├── script.js           # Core game logic and prediction algorithm
├── sounds.js           # Web Audio API sound generation system
└── README.md          # Comprehensive documentation
```

## 🎨 Design System

### **Color Palette**
- **Primary Background**: `#0a0a0a` (Deep black)
- **Card Background**: `#161616` (Dark gray)
- **Neon Green**: `#00ff88` (Primary accent)
- **Neon Red**: `#ff4757` (Warning/danger)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#b3b3b3` (Light gray)

### **Typography**
- **Primary Font**: Inter (Modern, clean sans-serif)
- **Mono Font**: JetBrains Mono (Technical data display)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)

### **Effects & Animations**
- **Neon Glow**: `box-shadow: 0 0 30px rgba(0, 255, 136, 0.4)`
- **Pulse Animation**: `animation: pulse 2s infinite`
- **Slide Up**: `animation: slideInUp 0.8s ease-out`
- **Hover Scale**: `transform: translateY(-3px) scale(1.05)`

## 🎵 Sound Effects

### **Interactive Sounds**
- **Click**: Sharp button press sound (800Hz, short decay)
- **Hover**: Subtle frequency sweep (1200Hz, quick fade)
- **Predict**: Ascending frequency sweep (200-600Hz)
- **Mine**: Explosive noise with low-frequency rumble
- **Safe**: Pleasant chime with harmonic overtones
- **Success**: Musical chord progression (C-E-G-C)
- **Error**: Wobbling tone with downward pitch
- **Reset**: Clean descending tone (400Hz, quick decay)

### **Sound Configuration**
```javascript
// Sound manager usage
soundManager.play('predict');     // Play prediction sound
soundManager.setEnabled(false);   // Disable all sounds
soundManager.setVolume(0.5);      // Set volume to 50%
```

## 📱 Browser Compatibility

- **Chrome/Edge**: 90+ (Full support including Web Audio API)
- **Firefox**: 88+ (Full support)
- **Safari**: 14+ (Web Audio API support)
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🔧 Customization

### **Grid Size Modification**
```javascript
// In script.js, modify:
this.gridSize = 6; // Change from 5x5 to 6x6
this.totalCells = this.gridSize * this.gridSize;
```

### **Color Scheme Changes**
```css
/* In styles.css, update CSS variables */
:root {
    --neon-green: #00ff88;    /* Change primary color */
    --neon-red: #ff4757;      /* Change warning color */
    --bg-primary: #0a0a0a;    /* Change background */
}
```

### **Sound Customization**
```javascript
// In sounds.js, modify frequency ranges
const freq = 200 + (t * 400); // Change frequency sweep range
data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5) * 0.4;
```

## 🎯 Game Mechanics

### **Mine Density Impact**
- **1 Mine**: 96% win rate (1.04x multiplier)
- **5 Mines**: 80% win rate (1.25x multiplier)
- **10 Mines**: 60% win rate (1.67x multiplier)
- **15 Mines**: 40% win rate (2.50x multiplier)
- **24 Mines**: 4% win rate (25.00x multiplier)

### **Algorithm Transparency**
- **Hash Processing**: Converts any string to numeric seed
- **Deterministic RNG**: Linear Congruential Generator for reproducible results
- **Position Mapping**: Maps random numbers to grid positions (0-24 for 5x5)
- **No Server Dependencies**: All processing happens client-side

## 🚀 Performance Optimizations

- **Efficient DOM Updates**: Minimal reflows and repaints
- **CSS Hardware Acceleration**: Transform-based animations
- **Sound Pooling**: Reuse audio buffers for better performance
- **Responsive Images**: SVG icons scale perfectly at any size
- **Minimal Dependencies**: No external libraries required

## 🔒 Security & Privacy

- **Client-Side Only**: No data transmitted to servers
- **Hash Privacy**: User input never leaves the browser
- **Transparent Algorithm**: All code visible and verifiable
- **No Tracking**: No analytics or user behavior tracking
- **Offline Capable**: Works without internet connection

## 🎮 Stake.bet Style Enhancements

### **Visual Design**
- **Neon Color Scheme**: Matches modern gambling platforms
- **Glowing Effects**: Dynamic shadows and highlights
- **Premium Typography**: Inter + JetBrains Mono combination
- **Card-Based Layout**: Organized, dashboard-style interface
- **Gradient Borders**: Subtle animated border effects

### **User Experience**
- **Immediate Feedback**: Visual and audio responses to all interactions
- **Loading States**: Progress indicators and status messages
- **Hover Effects**: Subtle animations on interactive elements
- **Smooth Transitions**: 300ms ease transitions throughout
- **Professional Polish**: Consistent spacing, alignment, and styling

### **Gaming Aesthetics**
- **Risk Visualization**: Color-coded mine density indicators
- **Multiplier Display**: Real-time payout calculations
- **Status Indicators**: Visual feedback for game states
- **Achievement System**: Success states and celebration effects
- **Quick Actions**: One-click sharing and data export

---

## 📄 License

This project demonstrates modern web development techniques and gambling platform design patterns. Feel free to modify and use according to your needs.

## 🤝 Contributing

To enhance this application:
1. Fork the repository
2. Add your improvements
3. Test across different browsers
4. Submit pull request with detailed description

---

**Built with ❤️ using HTML5, CSS3, and vanilla JavaScript**