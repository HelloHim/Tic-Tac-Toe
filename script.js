// Stores and manages the 3x3 board data
const gameBoard = (function () {
  let boardArray = [
    ["□", "□", "□"],
    ["□", "□", "□"],
    ["□", "□", "□"],
  ];

  // Returns the raw 2D array
  const getBoardArray = function () {
    return boardArray;
  };

  // Returns all cells as objects with their content and coordinates
  const getBoardContents = function () {
    return boardArray.flatMap((row, rowIndex) => {
      return row.map((element, columnIndex) => {
        return {
          cellContent: element,
          row: rowIndex,
          column: columnIndex,
        };
      });
    });
  };

  // Counts how many cells are still empty (□)
  const getRemainingCells = function () {
    return boardArray.flat().filter((item) => item === "□").length;
  };

  // Places the current player's marker on the chosen cell
  // Flip Y axis so 0,0 is bottom-left instead (array row 0 is top, so we invert)
  const updateBoard = function (cell, currentPlayer) {
    boardArray[2 - cell[1]][cell[0]] = currentPlayer;
  };

  return {
    getBoardArray,
    getBoardContents,
    getRemainingCells,
    updateBoard,
  };
})();

// Creates a player with a name and marker (X or O)
function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
}

// Controls the flow of the game: turns, win checking, outcome
const gameController = (function (gameBoard) {
  let boardArray = gameBoard.getBoardArray();
  // Randomly decide who goes first
  let currentTurn = Math.random() >= 0.5 ? "X" : "O";
  let gameOutcome = {
    gameStatus: "Ongoing",
    gameVictor: undefined,
  };

  // Places the current player's marker on the board
  const playTurn = (chosenCell) => {
    gameBoard.updateBoard(chosenCell, currentTurn);
  };

  const getCurrentTurn = () => currentTurn;

  // Swaps the active player between X and O
  const switchPlayerTurn = () => {
    currentTurn = currentTurn === "X" ? "O" : "X";
  };

  // Checks for a win or draw and updates gameOutcome
  const setGameOutcome = () => {
    // Check if any row is all X or all O
    const rowWin = boardArray.some((row) => {
      return row.every((cell) => cell === "X") || row.every((cell) => cell === "O");
    });

    // Check if any column is all X or all O
    const colWin = boardArray[0]
      .map(
        (_, colIndex) => boardArray.map((row) => row[colIndex]),
      )
      .some(
        (col) => col.every((cell) => cell === "X") || col.every((cell) => cell === "O"),
      );

    // Grab the main diagonal (top-left to bottom-right) and check it
    const mainDiagonal = boardArray.map((row, rowIndex) => {
      return row.filter((cell, columnIndex) => {
        return columnIndex === rowIndex;
      });
    });

    const diagonalWin =
      mainDiagonal.flat().every((cell) => cell === "X") || mainDiagonal.flat().every((cell) => cell === "O");

    if (rowWin || colWin || diagonalWin) {
      gameOutcome.gameStatus = "Victor";
      gameOutcome.gameVictor = getCurrentTurn();
    } else if (gameBoard.getRemainingCells() == 0) {
      gameOutcome.gameStatus = "Draw";
    }
  };

  const getGameOutcome = () => gameOutcome;

  return {
    getCurrentTurn,
    switchPlayerTurn,
    setGameOutcome,
    getGameOutcome,
    playTurn,
  };
})(gameBoard);

// Handles everything the player sees and interacts with in the DOM
const displayController = (function (gameBoard, gameController) {
  createPlayer("Player1", "X");
  createPlayer("Player2", "O");

  // Grab all 9 cells, the turn subheading, and the outcome subheading from the DOM
  const cells = document.querySelectorAll(".cell");
  const statusEl = document.querySelector("#status");
  const outcomeEl = document.querySelector("#outcome");

  // Map each DOM cell (index 0–8) to its value in boardArray and display it
  const renderBoard = () => {
    cells.forEach((cell, index) => {
      const r = Math.floor(index / 3); // visual row (0 = top)
      const c = index % 3;             // visual column (0 = left)
      const value = gameBoard.getBoardArray()[2 - r][c];
      cell.textContent = value === "□" ? "" : value;
    });
  };

  // Update the turn subheading and outcome subheading based on game state
  const updateStatus = () => {
    const outcome = gameController.getGameOutcome();
    if (outcome.gameStatus === "Victor") {
      statusEl.textContent = "";
      outcomeEl.textContent = `PLAYER ${outcome.gameVictor} WINS!`;
    } else if (outcome.gameStatus === "Draw") {
      statusEl.textContent = "";
      outcomeEl.textContent = "IT'S A TIE!";
    } else {
      statusEl.textContent = `Player ${gameController.getCurrentTurn()}'s turn`;
      outcomeEl.textContent = "";
    }
  };

  // Runs when a cell is clicked
  const handleClick = (index) => {
    const c = index % 3;
    const r = Math.floor(index / 3);

    // Do nothing if the cell is already taken or the game has ended
    if (gameBoard.getBoardArray()[2 - r][c] !== "□") return;
    if (gameController.getGameOutcome().gameStatus !== "Ongoing") return;

    gameController.playTurn([c, r]);
    gameController.setGameOutcome();
    renderBoard();

    // Only switch turns if the game is still going
    if (gameController.getGameOutcome().gameStatus === "Ongoing") {
      gameController.switchPlayerTurn();
    }

    updateStatus();
  };

  // Wire up a click listener on each cell
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index));
  });

  // Draw the empty board and set the initial turn message on page load
  renderBoard();
  updateStatus();
})(gameBoard, gameController);
