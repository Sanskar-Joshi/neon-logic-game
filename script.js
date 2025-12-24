let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let isVsComputer = false;

let scores = {
  X: 0,
  O: 0,
  tie: 0,
};

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// DOM elements
const newGameBtn = document.getElementById("newGameBtn");
const cells = document.querySelectorAll(".cell");
const currentPlayerDisplay = document.getElementById("currentPlayer");
const gameStatus = document.getElementById("gameStatus");
const resetBtn = document.getElementById("resetBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreTie = document.getElementById("scoreTie");
const modeSelection = document.getElementById("modeSelection");
const gameContainer = document.getElementById("gameContainer");
const pvcBtn = document.getElementById("pvcBtn");
const pvpBtn = document.getElementById("pvpBtn");

// Event Listeners for Mode Selection
pvcBtn.addEventListener("click", () => startGame(true));
pvpBtn.addEventListener("click", () => startGame(false));

function startGame(vsComputer) {
  isVsComputer = vsComputer;
  gameActive = true;
  modeSelection.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  resetGameBoard();
}

// Event Handlers
function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;
  if (isVsComputer && currentPlayer === "O") return;

  makeMove(index);

  // If it's vs Computer and still active, trigger computer move
  if (gameActive && isVsComputer && currentPlayer === "O") {
    currentPlayerDisplay.textContent = "Computer is Thinking...";
    currentPlayerDisplay.style.color = "#888";
    setTimeout(computerMove, 600);
  }
}

function makeMove(index) {
  const clickSound = document.getElementById("clickSound");

  if (clickSound) clickSound.play().catch(() => {});

  board[index] = currentPlayer;
  updateCell(index);

  if (checkWin()) {
    endGame(`Player ${currentPlayer} Wins!`);
    scores[currentPlayer]++;
    highlightWinningCells();
    updateScoreDisplay();
  } else if (checkTie()) {
    endGame(`It's a Tie!`);
    scores.tie++;
    updateScoreDisplay();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateDisplay();
  }
}

// Computer Logic (Random Move)
function computerMove() {
  if (!gameActive) return;
  let moveIndex = -1;

  // 1. ATTACK: Check if Computer (O) can win now
  moveIndex = findBestMove("O");

  // 2. DEFFEND: If can't win, check if player (X) is winning and block them
  if (moveIndex === -1) {
    moveIndex = findBestMove("X");
  }

  // 3. STRATEGY: Take Center if available (Index 4 is best spot)
  if (moveIndex === -1 && board[4] === "") {
    moveIndex = 4;
  }

  // 4. RANDOM: If no strategic move, pick random empty spot
  if (moveIndex === -1) {
    let emptyIndices = [];
    board.forEach((cell, index) => {
      if (cell === "") emptyIndices.push(index);
    });
    if (emptyIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      moveIndex = emptyIndices[randomIndex];
    }
  }

  // Execute the move
  if (moveIndex !== -1) {
    makeMove(moveIndex);
  }
}

// Helper to find winning/blocking moves
function findBestMove(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    // Check if 2 spots are filled by 'player' and the 3rd is empty
    if (board[a] === player && board[b] === player && board[c] === "") return c;
    if (board[a] === player && board[c] === player && board[b] === "") return b;
    if (board[b] === player && board[c] === player && board[a] === "") return a;
  }
  return -1;
}

function updateCell(index) {
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add("taken", currentPlayer.toLowerCase());
}

function checkWin() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function checkTie() {
  return board.every((cell) => cell !== "");
}

function highlightWinningCells() {
  const winPattern = winPatterns.find((pattern) => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });

  if (winPattern) {
    winPattern.forEach((index) => {
      cells[index].classList.add("winner");
    });
  }
}

function endGame(message) {
  if (!message.includes("Tie")) {
    const winSound = document.getElementById("winSound");
    if (winSound) winSound.play().catch(() => {});
  }
  gameActive = false;
  gameStatus.textContent = message;

  // Color the status message based on result
  if (message.includes("X")) gameStatus.style.color = "#ff0055";
  else if (message.includes("O")) gameStatus.style.color = "#00f3ff";
  else gameStatus.style.color = "#fff";

  currentPlayerDisplay.textContent = "Game Over";
}

function resetGameBoard() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  gameStatus.textContent = "";
  updateDisplay();
}

function goToMainMenu() {
  gameActive = false;
  gameContainer.classList.add("hidden");
  modeSelection.classList.remove("hidden");
  resetGameBoard();
}

function resetScore() {
  scores = {
    X: 0,
    O: 0,
    tie: 0,
  };
  updateScoreDisplay();
  resetGameBoard();
}

function updateDisplay() {
  currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  currentPlayerDisplay.style.color =
    currentPlayer === "X" ? "#ff0055" : "#00f3ff";
}

function updateScoreDisplay() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreTie.textContent = scores.tie;
}

function initializeGame() {
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
  });

  resetBtn.addEventListener("click", goToMainMenu);
  resetScoreBtn.addEventListener("click", resetScore);
  newGameBtn.addEventListener("click", resetGameBoard);
}

document.addEventListener("DOMContentLoaded", initializeGame);
