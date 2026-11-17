let audioCtx;
let isPlaying = false;
let beatInterval;

// Soft Romantic Piano/Music-Box Beat Generator (No external MP3 needed)
function startRomanticBeat() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (isPlaying) return;
    isPlaying = true;
    document.getElementById('music-toggle').textContent = '🎵';

    // Romantic arpeggio notes (C major 7 -> A minor 7 -> F major 7 -> G6)
    const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 329.63]  // G6
    ];

    let chordIndex = 0;
    let noteIndex = 0;

    function playNote() {
        if (!isPlaying) return;
        const now = audioCtx.currentTime;
        const freq = chords[chordIndex][noteIndex];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Soft warm envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.45);

        noteIndex++;
        if (noteIndex >= chords[chordIndex].length) {
            noteIndex = 0;
            chordIndex = (chordIndex + 1) % chords.length;
        }
    }

    playNote();
    beatInterval = setInterval(playNote, 550);
}

function toggleMusic() {
    if (isPlaying) {
        isPlaying = false;
        clearInterval(beatInterval);
        document.getElementById('music-toggle').textContent = '🔇';
    } else {
        startRomanticBeat();
    }
}

function startJourney() {
    startRomanticBeat();
    nextPage(2);
}

function nextPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('page' + pageNumber).classList.add('active');
}

// Runaway "No" button
function moveNoButton() {
    const noBtn = document.getElementById('noBtn');
    const x = Math.random() * 180 - 90;
    const y = Math.random() * 140 - 70;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function sayYes() {
    nextPage(6);
    // Burst of hearts
    for (let i = 0; i < 35; i++) {
        setTimeout(createHeart, i * 80);
    }
}

// Background floating hearts
function createHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('heart');
    const emojis = ['❤️', '💖', '💕', '🌸', '✨'];
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 12 + 14) + 'px';
    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

setInterval(createHeart, 600);
