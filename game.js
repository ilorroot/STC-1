// Card symbols for the memory game
const cardSymbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let isProcessing = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const gameOverModal = document.getElementById('game-over');
const playAgainBtn = document.getElementById('play-again-btn');
const finalMovesDisplay = document.getElementById('final-moves');
const finalTimeDisplay = document.getElementById('final-time');

// Initialize game
function initGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    isProcessing = false;

    // Update displays
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';
    gameOverModal.classList.add('hidden');

    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Create card pairs
    const cardPairs = [...cardSymbols, ...cardSymbols];
    
    // Shuffle cards
    cards = shuffle(cardPairs);

    // Render cards
    renderCards();
}

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render cards on the board
function renderCards() {
    gameBoard.innerHTML = '';
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.symbol = symbol;

        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${symbol}</div>
        `;

        card.addEventListener('click', () => handleCardClick(card, index));
        gameBoard.appendChild(card);
    });
}

// Handle card click
function handleCardClick(card, index) {
    // Start timer on first move
    if (moves === 0 && !timerInterval) {
        startTimer();
    }

    // Prevent clicking during processing or on already flipped/matched cards
    if (isProcessing || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')) {
        return;
    }

    // Flip card
    card.classList.add('flipped');
    flippedCards.push({ card, index, symbol: card.dataset.symbol });

    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        isProcessing = true;
        moves++;
        movesDisplay.textContent = moves;

        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Check if flipped cards match
function checkMatch() {
    const [first, second] = flippedCards;

    if (first.symbol === second.symbol) {
        // Match found
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matchedPairs++;
        pairsDisplay.textContent = matchedPairs;

        // Check if game is complete
        if (matchedPairs === cardSymbols.length) {
            endGame();
        }
    } else {
        // No match - flip cards back
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
    }

    // Reset flipped cards
    flippedCards = [];
    isProcessing = false;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// End game
function endGame() {
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Show game over modal
    setTimeout(() => {
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timerDisplay.textContent;
        gameOverModal.classList.remove('hidden');
    }, 500);
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Initialize game on page load
initGame();
