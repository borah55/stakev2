// Sound Manager for Mine Game - Stake.bet Style
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.enabled = true;
        this.volume = 0.3;
        this.initialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Generate sound effects programmatically
            await this.generateSounds();
            
            this.initialized = true;
            console.log('Sound system initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    async generateSounds() {
        // Generate different sound effects using Web Audio API
        this.sounds.set('click', await this.createClickSound());
        this.sounds.set('hover', await this.createHoverSound());
        this.sounds.set('predict', await this.createPredictSound());
        this.sounds.set('mine', await this.createMineSound());
        this.sounds.set('safe', await this.createSafeSound());
        this.sounds.set('success', await this.createSuccessSound());
        this.sounds.set('error', await this.createErrorSound());
        this.sounds.set('reset', await this.createResetSound());
        this.sounds.set('ambient', await this.createAmbientSound());
    }

    async createClickSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 30) * 0.3;
        }
        
        return buffer;
    }

    async createHoverSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            data[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 50) * 0.1;
        }
        
        return buffer;
    }

    async createPredictSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 200 + (t * 400); // Sweep from 200Hz to 600Hz
            data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5) * 0.4;
        }
        
        return buffer;
    }

    async createMineSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const noise = (Math.random() - 0.5) * 2;
            const explosion = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 8);
            data[i] = (noise * 0.3 + explosion * 0.7) * 0.6;
        }
        
        return buffer;
    }

    async createSafeSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const melody = Math.sin(2 * Math.PI * 523 * t) + Math.sin(2 * Math.PI * 659 * t) * 0.5;
            data[i] = melody * Math.exp(-t * 8) * 0.3;
        }
        
        return buffer;
    }

    async createSuccessSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.8, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Success chord progression
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const noteIndex = Math.floor(t * 4);
            const freq = notes[Math.min(noteIndex, notes.length - 1)];
            data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2) * 0.4;
        }
        
        return buffer;
    }

    async createErrorSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.4, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 200 + Math.sin(t * 20) * 50; // Wobble effect
            data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 6) * 0.5;
        }
        
        return buffer;
    }

    async createResetSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.15, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            data[i] = Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 15) * 0.25;
        }
        
        return buffer;
    }

    async createAmbientSound() {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const ambient = Math.sin(2 * Math.PI * 80 * t) * 0.1 + Math.random() * 0.02;
            data[i] = ambient;
        }
        
        return buffer;
    }

    play(soundName, volume = 1) {
        if (!this.enabled || !this.initialized || !this.sounds.has(soundName)) {
            return;
        }

        try {
            const buffer = this.sounds.get(soundName);
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            gainNode.gain.value = this.volume * volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Interactive sound methods
    playClick() { this.play('click'); }
    playHover() { this.play('hover'); }
    playPredict() { this.play('predict'); }
    playMine() { this.play('mine'); }
    playSafe() { this.play('safe'); }
    playSuccess() { this.play('success'); }
    playError() { this.play('error'); }
    playReset() { this.play('reset'); }
}

// Auto-initialize sound manager
let soundManager;

// Initialize sound when page loads
document.addEventListener('DOMContentLoaded', async () => {
    soundManager = new SoundManager();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.SoundManager = SoundManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}