// Initial state and game configuration
const x = "✕"; // reflects the mark of player 1.
const o = "◯"; // represents the mark of player 2 or the AI.
let StatusGame = ""; // saves the state of the game at that moment, such as the player's turn.
let nextStarter = "P1"; // Indicates who start the next game
let player1Name = ""; // Player 1 name.
let player2Name = ""; // Player 2 name.
let isPlayingWithAI = false; // shows whether the game is AI-only.
let AIDifficulty = "easy"; // AI tier of difficulty

// DOM element references to manage the game user interface.
const mainMenu = document.getElementById("newMainMenu");
const playerInputs1v1 = document.getElementById("playerInputs1v1");
const playerInputsVsAI = document.getElementById("playerInputsVsAI");
const board = document.getElementById("board");
const modal = document.querySelector("dialog");
const textModal = modal.querySelector("h2");
const squares = document.querySelectorAll(".square");

// Events for the buttons on the main menu to reset and return.
document
  .getElementById("restartButton")
  .addEventListener("click", () => resetGame(true));
document
  .getElementById("returnToMenuButton")
  .addEventListener("click", () => resetGame(false));

// Square index combinations that result in a winning line are known as winning patterns.
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

/**
 * adjusts the User interfaze components visibility based on the current status of the game.
 * @param {HTMLElement} section The game section to show.
 */
function showSection(section) {
  mainMenu.style.display = section === mainMenu ? "flex" : "none";
  playerInputs1v1.style.display = section === playerInputs1v1 ? "flex" : "none";
  playerInputsVsAI.style.display =
    section === playerInputsVsAI ? "flex" : "none";
  board.style.display = section === board ? "grid" : "none";
}

/**
 * resets the initial player and clears the player names.
 */
function clearPlayerNames() {
  document.getElementById("player1Name").value = "";
  document.getElementById("player2Name").value = "";
  document.getElementById("player1NameAI").value = "";
  nextStarter = "P1";
}

/**
 * after player identities are confirmed, creates the game state, displays the board, and starts the game.
 * @returns void
 */
function startGame() {
  if (!validateNames()) return; // Verifies names prior to initiating.
  StatusGame = nextStarter; // determines who plays first.
  cleanGameBoard(); // puts the board in order for a fresh game.
  showSection(board); // shows the board.
  nextStarter = nextStarter === "P1" ? "P2" : "P1"; // For the following game, switch up who starts.
}

/**
 * cleans the board and, if open, closes the draw or victory modal.
 */
function cleanGameBoard() {
  squares.forEach((square) => {
    square.textContent = ""; // eliminates every mark from the board.
    square.classList.remove("winner"); // eliminates the class that won from the squares.
  });
}

/**
 * depending on the parameter, resets the game. If false, clears the names and shows the main menu; if true, only resets the board.
 * @param {boolean} restart decides whether to go back to the main menu or restart the game.
 */
function resetGame(restart) {
  cleanGameBoard(); // Cleans the board.
  modal.close(); // Closes the modal.

  if (restart) {
    StatusGame = nextStarter; // Sets the next starting player.
  } else {
    clearPlayerNames(); // Clears the player names.
    showSection(mainMenu); // Displays the main menu.
    StatusGame = "P1"; // Resets the game state.
  }
}

/**
 * Whether to go back to the main menu or restart the game is decided.
 * @returns {boolean} True when the names are legitimate; false when they aren't
 */
function validateNames() {
  player1Name = document
    .getElementById(isPlayingWithAI ? "player1NameAI" : "player1Name")
    .value.trim();
  player2Name = isPlayingWithAI
    ? "AI"
    : document.getElementById("player2Name").value.trim();

  if (!player1Name || (!isPlayingWithAI && !player2Name)) {
    alert("Please enter name."); // Alerts if any name is missing.
    return false;
  }
  return true;
}

/**
 * manages the current round, moves on to the next player's turn, and determines if there is a winner or a draw.
 * @returns void
 */
function handleTurn() {
  const winnerPosition = checkWinner(); // Checks for a winner.
  if (winnerPosition) {
    endGame(winnerPosition); // Ends the game if there's a winner.
    return;
  }

  if (isDraw()) {
    viewModal("Draw"); // if the board is filled, displays the draw modal.
    return;
  }

  togglePlayer(); // Switches to the next player.
  if (isPlayingWithAI && StatusGame === "P2") {
    makeAIMove(); // Makes AI move if it's their turn.
  }
}

/**
 * checks to see who wins by contrasting the winning patterns with the status of the board at that moment.
 * @returns {Array|null} spots for winners or null in the absence of a winner.
 */
function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      squares[a].textContent &&
      squares[a].textContent === squares[b].textContent &&
      squares[a].textContent === squares[c].textContent
    ) {
      return pattern; // gives back the winning design.
    }
  }
  return null; // No winner.
}

/**
 * displays a winner message and highlights the winning squares to end the game.
 * @param {Array} winnerPositions Positions of the squares forming the winning line.
 */
function endGame(winnerPositions) {
  winnerPositions.forEach((pos) => squares[pos].classList.add("winner")); // accentuates the squares that won.
  const winnerName = StatusGame === "P1" ? player1Name : player2Name;
  viewModal(`${winnerName} has won`); // Shows victory message.
  StatusGame = "Pause"; // Pauses the game to prevent further moves.
}

/**
 * Verifies if there is a draw indicated by the board being full without a winner.
 * @returns {boolean} True when there's a draw, false when there are still moves that can be made.
 */
function isDraw() {
  return [...squares].every((square) => square.textContent); // Checks if all squares are filled.
}

/**
 * gives the next player control of the game.
 */
function togglePlayer() {
  StatusGame = StatusGame === "P1" ? "P2" : "P1"; // Switches between Player 1 and Player 2.
}

/**
 * displays a modal with a specific message, such as the draw or the winner.
 * @param {string} text The text that appears in the modal.
 */
function viewModal(text) {
  textModal.innerText = text; // Sets the modal text.
  modal.showModal(); // Shows the modal.
}

// Events that regulate the logic of the game in reaction to clicks on the user interface.
[
  "play1v1Button",
  "playVsAIButton",
  "backButton1v1",
  "backButtonVsAI",
  "startGame1v1",
  "easyAI",
  "mediumAI",
  "hardAI",
].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("click", (event) => handleGameControl(event));
});

/**
 * regulates the logic of the game in reaction to button click occurrences.
 * @param {Event} event The thing that sets off the action.
 */
function handleGameControl(event) {
  const { id } = event.target;
  switch (id) {
    case "play1v1Button": // Sets up the game for 1 vs 1.
      isPlayingWithAI = false;
      showSection(playerInputs1v1);
      break;
    case "playVsAIButton": // Sets up the game to play vs AI.
      isPlayingWithAI = true;
      showSection(playerInputsVsAI);
      break;
    case "backButton1v1":
    case "backButtonVsAI": // Returns to the main menu.
      showSection(mainMenu);
      break;
    case "startGame1v1": // Starts the game.
    case "easyAI":
    case "mediumAI":
    case "hardAI": // Sets the AI difficulty and starts the game.
      AIDifficulty = id.endsWith("AI") ? id.replace("AI", "") : AIDifficulty;
      startGame();
      break;
  }
}

// Players are able to move around the board with events for every tile.
squares.forEach((square, i) => {
  square.addEventListener("click", () => {
    if (
      StatusGame === "Pause" || // stops movements when the game is paused.
      square.textContent || // keeps a mark from being made on a square that is already occupied.
      (isPlayingWithAI && StatusGame === "P2") // stops the player from moving when the AI is in control.
    )
      return;
    square.textContent = StatusGame === "P1" ? x : o; // lays the mark of the active player on the square.
    handleTurn(); // Processes the turn.
  });
});

/**
 * Makes an AI move based on the set difficulty.
 */
function makeAIMove() {
  let move = null; // Initializes the move variable.
  // Selects the move based on difficulty.
  switch (AIDifficulty) {
    case "easy":
      move = getRandomMove(); // Gets a random move.
      break;
    case "medium":
      move = getBlockingMove() || getRandomMove(); // Blocks or picks random if no block is needed.
      break;
    case "hard":
      move = getWinningMove() || getBlockingMove() || getRandomMove(); // Tries to win, block, or moves randomly.
      break;
  }

  if (move) {
    move.textContent = o; // puts the mark of the AI on the board.
    handleTurn(); // Analyzes the next move made by the AI.
  }
}

/**
 * Gets a random move from the available squares.
 * @returns {HTMLElement|null} The square for the move or null if no moves are available.
 */
function getRandomMove() {
  let availableSquares = [...squares].filter((sq) => !sq.textContent); // Filters unmarked squares.
  if (availableSquares.length === 0) return null; // Returns null if all squares are occupied.
  return availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Selects a random square.
}

/**
 * seeks a move that, in the following turn, prevents player 1 from winning.
 * @returns {HTMLElement|null} The move-blocking square, or null if not required.
 */
function getBlockingMove() {
  for (const pattern of winPatterns) {
    let xCount = 0,
      emptyIndex = -1;
    for (const index of pattern) {
      if (squares[index].textContent === x) xCount++;
      else if (!squares[index].textContent) emptyIndex = index;
    }
    if (xCount === 2 && emptyIndex !== -1) return squares[emptyIndex]; // Returns the square to block.
  }
  return null; // No blocking move found.
}

/**
 * searches for a move that will let the AI win the match.
 * @returns {HTMLElement|null} The square represents the winning move, or null if a win is not feasible.
 */
function getWinningMove() {
  for (const pattern of winPatterns) {
    let oCount = 0,
      emptyIndex = -1;
    for (const index of pattern) {
      if (squares[index].textContent === o) oCount++;
      else if (!squares[index].textContent) emptyIndex = index;
    }
    if (oCount === 2 && emptyIndex !== -1) return squares[emptyIndex]; // Returns the square to win.
  }
  return null; // No winning move found.
}
