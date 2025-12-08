// Mine Predictor Game Logic
class MinePredictor {
    constructor() {
        this.gridSize = 5;
        this.totalCells = this.gridSize * this.gridSize;
        this.gameGrid = [];
        this.predictedMines = new Set();
        this.hashSeed = '';
        this.mineAmount = 1;
        this.predictionCount = 0;
        this.gameStartTime = 0;
        this.isAutoMode = false;
        this.currentMultiplier = 1.0;
        
        this.init();
    }

    init() {
        this.createGrid();
        this.bindEvents();
        this.updateStats();
    }

    // Create the game grid
    createGrid() {
        const gridContainer = document.getElementById('gameGrid');
        gridContainer.innerHTML = '';
        
        this.gameGrid = [];
        this.predictedMines.clear();
        
        for (let i = 0; i < this.totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            
            // Add SVG icon element
            const icon = document.createElement('div');
            icon.className = 'cell-icon';
            cell.appendChild(icon);
            
            // Add click event
            cell.addEventListener('click', () => this.revealCell(i));
            
            // Add hover sound
            cell.addEventListener('mouseenter', () => {
                if (window.soundManager) window.soundManager.playHover();
            });
            
            gridContainer.appendChild(cell);
            this.gameGrid.push({
                element: cell,
                icon: icon,
                isMine: false,
                isRevealed: false,
                isPredicted: false
            });
        }
        
        this.updateGameInfo();
    }

    // Generate mines based on hash seed
    async generateMines(hashSeed, mineAmount) {
        this.hashSeed = hashSeed;
        this.mineAmount = mineAmount;
        this.predictedMines.clear();
        this.gameStartTime = Date.now();
        
        // Play prediction sound
        if (window.soundManager) window.soundManager.playPredict();
        
        // Update game status
        this.updateGameStatus('Generating Prediction...', 'loading');
        
        // Add loading effect to grid
        document.getElementById('gameGrid').classList.add('loading');
        
        // Simulate processing delay for better UX
        await this.delay(300 + Math.random() * 200);
        
        // Clear previous predictions
        this.gameGrid.forEach(cell => {
            cell.element.classList.remove('predicted-safe', 'predicted-mine', 'revealed-safe', 'revealed-mine');
            cell.icon.innerHTML = '';
            cell.icon.className = 'cell-icon';
            cell.isPredicted = false;
            cell.isRevealed = false;
        });
        
        // Generate mine positions using hash
        const minePositions = this.generateMinePositions(hashSeed, mineAmount);
        
        // Apply predictions to grid with stagger effect
        let delay = 0;
        minePositions.forEach((position, index) => {
            setTimeout(() => {
                if (position < this.totalCells) {
                    this.predictedMines.add(position);
                    const cell = this.gameGrid[position];
                    cell.isPredicted = true;
                    cell.element.classList.add('predicted-mine');
                    cell.icon.innerHTML = this.getBombIcon();
                    cell.icon.className = 'cell-icon icon-bomb';
                    
                    // Play mine sound
                    if (window.soundManager && index === minePositions.length - 1) {
                        window.soundManager.playMine();
                    }
                }
            }, delay);
            delay += 50;
        });
        
        // Mark safe cells with stagger effect
        delay += 100;
        for (let i = 0; i < this.totalCells; i++) {
            if (!this.predictedMines.has(i)) {
                setTimeout(() => {
                    const cell = this.gameGrid[i];
                    cell.element.classList.add('predicted-safe');
                    cell.icon.innerHTML = this.getGemIcon();
                    cell.icon.className = 'cell-icon icon-gem';
                }, delay);
                delay += 30;
            }
        }
        
        // Calculate and update multiplier
        this.calculateMultiplier();
        
        // Remove loading effect
        setTimeout(() => {
            document.getElementById('gameGrid').classList.remove('loading');
            this.updateGameStatus('Prediction Complete', 'success');
            
            // Play success sound after all animations
            if (window.soundManager) {
                setTimeout(() => window.soundManager.playSuccess(), 1000);
            }
        }, 1500);
        
        this.predictionCount++;
        this.updateStats();
    }

    // Update game status display
    updateGameStatus(message, type = 'normal') {
        const statusElement = document.getElementById('gameStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('span:last-child');
        
        text.textContent = message;
        
        // Reset classes
        indicator.className = 'status-indicator';
        
        // Add appropriate class
        switch (type) {
            case 'loading':
                indicator.classList.add('loading');
                break;
            case 'success':
                indicator.classList.add('success');
                break;
            case 'error':
                indicator.classList.add('error');
                break;
        }
    }

    // Calculate current multiplier based on mine density
    calculateMultiplier() {
        const safeCells = this.totalCells - this.mineAmount;
        const winProbability = safeCells / this.totalCells;
        
        // House edge of 1%
        const houseEdge = 0.01;
        const fairMultiplier = 1 / winProbability;
        this.currentMultiplier = fairMultiplier * (1 - houseEdge);
        
        this.updateMultiplierDisplay();
    }

    // Update multiplier display
    updateMultiplierDisplay() {
        const multiplierElement = document.getElementById('currentMultiplier');
        if (multiplierElement) {
            multiplierElement.textContent = this.currentMultiplier.toFixed(2) + 'x';
        }
    }

    // Delay helper for animations
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate mine positions using hash seed
    generateMinePositions(hashSeed, mineAmount) {
        const positions = [];
        const used = new Set();
        
        // Create a deterministic seed from hash
        const seed = this.createSeedFromHash(hashSeed);
        
        // Use seeded random number generator
        let random = this.seededRandom(seed);
        
        while (positions.length < mineAmount && used.size < this.totalCells) {
            const position = Math.floor(random() * this.totalCells);
            if (!used.has(position)) {
                used.add(position);
                positions.push(position);
            }
        }
        
        return positions;
    }

    // Create numeric seed from hash string
    createSeedFromHash(hashString) {
        if (!hashString || hashString.length === 0) {
            hashString = Date.now().toString();
        }
        
        // Simple hash to seed conversion
        let hash = 0;
        for (let i = 0; i < hashString.length; i++) {
            const char = hashString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash);
    }

    // Simple seeded random number generator (LCG)
    seededRandom(seed) {
        let state = seed || Date.now();
        return function() {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }

    // Reveal a cell (for demo purposes)
    revealCell(index) {
        const cell = this.gameGrid[index];
        if (cell.isRevealed) return;
        
        cell.isRevealed = true;
        
        // Play click sound
        if (window.soundManager) window.soundManager.playClick();
        
        if (this.predictedMines.has(index)) {
            // It's a mine
            cell.element.classList.add('revealed-mine');
            cell.icon.innerHTML = this.getBombIcon();
            cell.icon.className = 'cell-icon icon-bomb';
            
            // Play mine sound
            if (window.soundManager) window.soundManager.playMine();
        } else {
            // It's safe
            cell.element.classList.add('revealed-safe');
            cell.icon.innerHTML = this.getGemIcon();
            cell.icon.className = 'cell-icon icon-gem';
            
            // Play safe sound
            if (window.soundManager) window.soundManager.playSafe();
        }
    }

    // Reset the grid
    resetGrid() {
        // Play reset sound
        if (window.soundManager) window.soundManager.playReset();
        
        // Update status
        this.updateGameStatus('Grid Reset', 'normal');
        
        this.gameGrid.forEach(cell => {
            cell.element.className = 'grid-cell';
            cell.icon.innerHTML = '';
            cell.icon.className = 'cell-icon';
            cell.isRevealed = false;
            cell.isPredicted = false;
        });
        
        this.predictedMines.clear();
        this.hashSeed = '';
        this.mineAmount = 1;
        this.currentMultiplier = 1.0;
        this.updateGameInfo();
        this.updateStats();
        this.updateMultiplierDisplay();
    }

    // Update game info display
    updateGameInfo() {
        document.getElementById('gridSize').textContent = `${this.gridSize}×${this.gridSize}`;
        document.getElementById('minesCount').textContent = this.predictedMines.size;
        document.getElementById('safeCount').textContent = this.totalCells - this.predictedMines.size;
    }

    // Update statistics
    updateStats() {
        document.getElementById('totalPredictions').textContent = this.predictionCount;
        document.getElementById('usedHash').textContent = this.hashSeed || 'None';
        
        const density = this.totalCells > 0 ? (this.predictedMines.size / this.totalCells * 100).toFixed(1) : 0;
        document.getElementById('mineDensity').textContent = `${density}%`;
        
        const winProbability = this.totalCells > 0 ? 
            ((this.totalCells - this.predictedMines.size) / this.totalCells * 100).toFixed(1) : 100;
        document.getElementById('winProbability').textContent = `${winProbability}%`;
    }

    // Get SVG icons
    getGemIcon() {
        return `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }

    getBombIcon() {
        return `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.69 2 5.68 4.36 4.75 7.26c-.18.56-.27 1.14-.27 1.74s.09 1.18.27 1.74c.93 2.9 3.94 5.26 7.25 5.26s6.32-2.36 7.25-5.26c.18-.56.27-1.14.27-1.74s-.09-1.18-.27-1.74C18.32 4.36 15.31 2 12 2zm0 3c2.76 0 5 2.24 5 5 0 1.25-.47 2.39-1.26 3.29L12 16.75 8.26 13.29C7.47 12.39 7 11.25 7 10c0-2.76 2.24-5 5-5zm0 2c-1.66 0-3 1.34-3 3 0 .75.27 1.43.73 1.95L12 14.38l2.27-2.43c.46-.52.73-1.2.73-1.95 0-1.66-1.34-3-3-3z"/>
            </svg>
        `;
    }

    // Bind event listeners
    bindEvents() {
        const predictBtn = document.getElementById('predictBtn');
        const resetBtn = document.getElementById('resetBtn');
        const autoBtn = document.getElementById('autoBtn');
        const hashInput = document.getElementById('hashSeed');
        const mineSelect = document.getElementById('mineAmount');
        const soundToggle = document.getElementById('soundEnabled');

        // Button click sounds and actions
        predictBtn.addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.handlePredict();
        });

        resetBtn.addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.resetGrid();
        });

        autoBtn.addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.toggleAutoMode();
        });

        // Sound toggle
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (window.soundManager) {
                    window.soundManager.setEnabled(e.target.checked);
                }
                if (window.soundManager && e.target.checked) {
                    window.soundManager.playClick();
                }
            });
        }

        // Enhanced input interactions
        hashInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (window.soundManager) window.soundManager.playClick();
                this.handlePredict();
            }
        });

        hashInput.addEventListener('input', () => {
            if (window.soundManager) window.soundManager.playHover();
        });

        mineSelect.addEventListener('change', () => {
            if (window.soundManager) window.soundManager.playHover();
            this.mineAmount = parseInt(mineSelect.value);
            this.calculateMultiplier();
        });

        // Auto-generate hash if empty
        hashInput.addEventListener('blur', () => {
            if (!hashInput.value.trim()) {
                hashInput.value = this.generateRandomHash();
            }
        });

        // Additional quick action buttons
        this.bindQuickActions();
    }

    // Bind quick action buttons
    bindQuickActions() {
        const shareBtn = document.getElementById('shareBtn');
        const copyHashBtn = document.getElementById('copyHashBtn');
        const exportBtn = document.getElementById('exportBtn');

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.shareResult();
            });
        }

        if (copyHashBtn) {
            copyHashBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.copyHash();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.exportData();
            });
        }
    }

    // Handle predict button click
    handlePredict() {
        const hashInput = document.getElementById('hashSeed');
        const mineSelect = document.getElementById('mineAmount');
        
        const hashSeed = hashInput.value.trim();
        const mineAmount = parseInt(mineSelect.value);
        
        if (!hashSeed) {
            hashInput.value = this.generateRandomHash();
            return this.handlePredict();
        }
        
        if (mineAmount >= this.totalCells) {
            alert('Mine amount cannot exceed total grid cells!');
            return;
        }
        
        this.generateMines(hashSeed, mineAmount);
    }

    // Generate a random hash for demo
    generateRandomHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    }

    // Auto predict mode
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        const autoBtn = document.getElementById('autoBtn');
        
        if (this.isAutoMode) {
            autoBtn.textContent = '⏹️ STOP AUTO';
            autoBtn.style.backgroundColor = 'var(--neon-red)';
            this.startAutoPredict();
        } else {
            autoBtn.textContent = '🎯 AUTO PREDICT';
            autoBtn.style.backgroundColor = 'transparent';
        }
    }

    startAutoPredict() {
        if (!this.isAutoMode) return;
        
        setTimeout(() => {
            if (this.isAutoMode) {
                this.handlePredict();
                this.startAutoPredict();
            }
        }, 2000 + Math.random() * 1000);
    }

    // Quick action methods
    shareResult() {
        if (!this.hashSeed) {
            if (window.soundManager) window.soundManager.playError();
            return;
        }

        const shareText = `🎮 Mines Prediction Result\n` +
                         `Hash: ${this.hashSeed.substring(0, 16)}...\n` +
                         `Mines: ${this.mineAmount}/25\n` +
                         `Multiplier: ${this.currentMultiplier.toFixed(2)}x\n` +
                         `Generated with Mines Predictor`;

        if (navigator.share) {
            navigator.share({ text: shareText });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard!');
            });
        }
    }

    copyHash() {
        if (!this.hashSeed) {
            if (window.soundManager) window.soundManager.playError();
            return;
        }

        navigator.clipboard.writeText(this.hashSeed).then(() => {
            if (window.soundManager) window.soundManager.playSuccess();
            // Show temporary success message
            const btn = document.getElementById('copyHashBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ COPIED!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            hashSeed: this.hashSeed,
            mineAmount: this.mineAmount,
            gridSize: this.gridSize,
            predictionCount: this.predictionCount,
            currentMultiplier: this.currentMultiplier,
            minePositions: Array.from(this.predictedMines)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mines-prediction-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (window.soundManager) window.soundManager.playSuccess();
    }

}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new MinePredictor();
    
    // Generate initial hash for demo
    document.getElementById('hashSeed').value = game.generateRandomHash();
    
    // Initialize sound manager
    if (window.SoundManager) {
        window.soundManager = new SoundManager();
    }
});

// Utility functions for enhanced UX
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Could add toast notification here
        console.log('Copied to clipboard:', text);
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinePredictor;
}