let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameBoardElement = null;
let gameStatusElement = null;

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function renderGameBoard() {
    const container = document.getElementById('game');
    if (!container) return;
    
    container.innerHTML = `
        <div class="game-container">
            <div class="game-status" id="gameStatus">Ход игрока: X</div>
            <div class="game-board" id="gameBoard"></div>
            <button class="reset-btn" id="resetGameBtn">🔄 Новая игра</button>
        </div>
    `;
    
    gameBoardElement = document.getElementById('gameBoard');
    gameStatusElement = document.getElementById('gameStatus');
    
    if (!gameBoardElement) return;
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoardElement.appendChild(cell);
    }
    
    const resetBtn = document.getElementById('resetGameBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    
    updateBoardUI();
}

function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') return;
    
    gameBoard[index] = currentPlayer;
    updateBoardUI();
    
    if (checkWin()) {
        if (gameStatusElement) gameStatusElement.innerText = `🏆 Игрок ${currentPlayer} победил! 🏆`;
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        if (gameStatusElement) gameStatusElement.innerText = `🤝 Ничья! 🤝`;
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameStatusElement) gameStatusElement.innerText = `Ход игрока: ${currentPlayer}`;
}

function checkWin() {
    for (const pattern of winPatterns) {
        const [a,b,c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function updateBoardUI() {
    if (!gameBoardElement) return;
    const cells = gameBoardElement.querySelectorAll('.cell');
    cells.forEach((cell, idx) => {
        cell.innerText = gameBoard[idx];
    });
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    if (gameStatusElement) gameStatusElement.innerText = 'Ход игрока: X';
    updateBoardUI();
}

function initGame() {
    renderGameBoard();
}

window.initGame = initGame;
