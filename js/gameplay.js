// gameplay.js - Core game logic

const ROWS = 6;
const COLS = 5;

// Change this for different daily puzzles
let target = ['🔴', '🟢', '🔵', '🟡', '🟣'];

let boardState = Array(ROWS).fill().map(() => Array(COLS).fill(''));
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const shareBtn = document.getElementById('share-btn');

// Create board
function createBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            boardEl.appendChild(tile);
        }
    }
}

function updateBoard() {
    const tiles = boardEl.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const r = Math.floor(index / COLS);
        const c = index % COLS;
        tile.textContent = boardState[r][c];
    });
}

function submitGuess() {
    if (gameOver) return;
    
    const guess = boardState[currentRow];
    if (guess.includes('')) {
        showMessage("Complete the row first!", "#ffcc00");
        return;
    }

    const tiles = boardEl.querySelectorAll('.tile');
    const rowStart = currentRow * COLS;
    let correctCount = 0;

    // Green
    for (let i = 0; i < COLS; i++) {
        const tile = tiles[rowStart + i];
        if (guess[i] === target[i]) {
            tile.classList.add('correct');
            correctCount++;
        }
    }

    // Yellow / Gray
    for (let i = 0; i < COLS; i++) {
        const tile = tiles[rowStart + i];
        if (!tile.classList.contains('correct')) {
            if (target.includes(guess[i])) {
                tile.classList.add('present');
            } else {
                tile.classList.add('absent');
            }
        }
    }

    if (correctCount === COLS) {
        gameOver = true;
        showMessage("🎉 Excellent! You solved it!", "#538d4e");
        shareBtn.classList.remove('hidden');
        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === ROWS) {
        gameOver = true;
        showMessage(`Game Over! Answer: ${target.join(' ')}`, "#ff4444");
        shareBtn.classList.remove('hidden');
    }
}

function showMessage(text, color = "#fff") {
    messageEl.textContent = text;
    messageEl.style.color = color;
    messageEl.classList.remove('hidden');
    setTimeout(() => messageEl.classList.add('hidden'), 2800);
}

// Physical keyboard
function handleKey(e) {
    if (gameOver) return;
    const key = e.key.toUpperCase();

    if (key === "ENTER") {
        submitGuess();
    } else if (key === "BACKSPACE") {
        if (currentCol > 0) {
            currentCol--;
            boardState[currentRow][currentCol] = '';
            updateBoard();
        }
    } else if (key.length === 1 && /[A-Z0-9]/.test(key)) {
        if (currentCol < COLS) {
            boardState[currentRow][currentCol] = key;
            currentCol++;
            updateBoard();
        }
    }
}

// On-screen keyboard
const keyboardLayout = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function createOnScreenKeyboard() {
    const keyboardEl = document.getElementById('keyboard');
    keyboardEl.innerHTML = '';

    keyboardLayout.forEach(rowStr => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'center';
        row.style.gap = '6px';
        row.style.marginBottom = '8px';

        rowStr.split('').forEach(letter => {
            const key = document.createElement('div');
            key.classList.add('key');
            key.textContent = letter;
            key.addEventListener('click', () => {
                if (currentCol < COLS && !gameOver) {
                    boardState[currentRow][currentCol] = letter;
                    currentCol++;
                    updateBoard();
                }
            });
            row.appendChild(key);
        });
        keyboardEl.appendChild(row);
    });

    // Enter & Backspace row
    const bottom = document.createElement('div');
    bottom.style.display = 'flex';
    bottom.style.justifyContent = 'center';
    bottom.style.gap = '8px';

    const enter = document.createElement('div');
    enter.classList.add('key');
    enter.textContent = 'ENTER';
    enter.style.minWidth = '80px';
    enter.addEventListener('click', submitGuess);
    bottom.appendChild(enter);

    const back = document.createElement('div');
    back.classList.add('key');
    back.textContent = '⌫';
    back.style.minWidth = '60px';
    back.addEventListener('click', () => {
        if (currentCol > 0 && !gameOver) {
            currentCol--;
            boardState[currentRow][currentCol] = '';
            updateBoard();
        }
    });
    bottom.appendChild(back);

    keyboardEl.appendChild(bottom);
}

// Share
shareBtn.addEventListener('click', () => {
    const text = `Chainle ${currentRow}/6\n` + 
                 boardState.map(r => r.join('')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
        showMessage("✅ Score copied to clipboard!", "#538d4e");
    });
});

// Initialize
createBoard();
updateBoard();
createOnScreenKeyboard();
document.addEventListener('keydown', handleKey);

console.log('%c✅ Chainle is ready to play!', 'color: lime; font-weight: bold');