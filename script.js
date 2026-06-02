const gameBoard = (function () {
  let boardArray = [
    ["□", "□", "□"],
    ["□", "□", "□"],
    ["□", "□", "□"],
  ];

  const getBoardArray = function () {
    return boardArray;
  };

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

  const getRemainingCells = function () {
    return boardArray.flat().filter((item) => item === "□").length;
  };

  const updateBoard = function (cell, currentPlayer) {
    // Flip Y axis so 0,0 is bottom-left instead (array row 0 is top, so we invert)
    boardArray[2 - cell[1]][cell[0]] = currentPlayer;
  };

  return {
    getBoardArray,
    getBoardContents,
    getRemainingCells,
    updateBoard,
  };
})();

function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
}

const gameController = (function (gameBoard) {
  let boardArray = gameBoard.getBoardArray();
  let currentTurn = Math.random() >= 0.5 ? "X" : "O";
  let gameOutcome = {
    gameStatus: "Ongoing",
    gameVictor: undefined,
  };

  const playTurn = (chosenCell) => {
    gameBoard.updateBoard(chosenCell, currentTurn);
  };

  const getCurrentTurn = () => currentTurn;

  const switchPlayerTurn = () => {
    currentTurn = currentTurn === "X" ? "O" : "X";
  };

  const setGameOutcome = () => {
    // some() - does any row have all X/O's?
    // every() - is this one row all X/O's?
    const rowWin = boardArray.some((row) => {
      return row.every((cell) => cell === "X") || row.every((cell) => cell === "O");
    });

    // check if any column is all X's or all O's
    const colWin = boardArray[0] // use the first row just to know how many columns exist
      .map(
        (_, colIndex) => boardArray.map((row) => row[colIndex]), // grab this column from every row
      )
      .some(
        (
          col, // check if any column passes the test
        ) => col.every((cell) => cell === "X") || col.every((cell) => cell === "O"),
      );

    let diagonalWin;

    const mainDiagonal = boardArray.map((row, rowIndex) => {
      return row.filter((cell, columnIndex) => {
        return columnIndex === rowIndex;
      });
    });

    diagonalWin =
      mainDiagonal.flat().every((cell) => cell === "X") || mainDiagonal.flat().every((cell) => cell === "O");

    if (rowWin || colWin || diagonalWin) {
      console.log(`${currentTurn} WON`);
      gameOutcome.gameStatus = "Victor";
      gameOutcome.gameVictor = getCurrentTurn();
    } else if (gameBoard.getRemainingCells() == 0) {
      console.log("DRAW");
      gameOutcome.gameStatus = "Draw";
    } else {
      console.log("ONGOING MATCH");
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

const displayController = (function (gameBoard, gameController) {
  const displayBoardArray = () => {
    // Copy and reverse the array so row 0 appears at the bottom (matching user coordinates)
    const rows = [...gameBoard.getBoardArray()].reverse();
    // Loop through each row top to bottom
    for (const row of rows) {
      // Print each cell in the row separated by a space e.g. "□ □ □"
      console.log(row.join(" "));
    }
  };

  const displayCurrentTurn = () => {
    console.log(`Current Turn - Player ${gameController.getCurrentTurn()}`);
  };

  const displayGameOutcome = () => {
    console.log(gameController.getGameOutcome());
  };

  return {
    displayBoardArray,
    displayCurrentTurn,
    displayGameOutcome,
  };
})(gameBoard, gameController);

const playGame = (function (gameController, gameBoard, displayController) {
  createPlayer("Player1", "X");
  createPlayer("Player2", "O");

  while (gameController.getGameOutcome().gameStatus === "Ongoing") {
    displayController.displayBoardArray();
    displayController.displayCurrentTurn();
    let userCellChoice = prompt("Choose your square!")
      .split(",")
      .map((num) => num.trim());
    gameController.playTurn(userCellChoice);
    gameController.setGameOutcome();
    if (gameController.getGameOutcome().gameStatus !== "Ongoing") {
      displayController.displayBoardArray();
      displayController.displayGameOutcome();
      break;
    }
    gameController.switchPlayerTurn();
  }
})(gameController, gameBoard, displayController);
