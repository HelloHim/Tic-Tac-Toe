const gameBoard = (function () {
  let boardArray = [
    ["□", "□", "□"],
    ["□", "□", "□"],
    ["□", "□", "□"],
  ];

  getBoardArray = function () {
    return boardArray;
  };

  getBoardContents = function () {
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

  getRemainingCells = function () {
    return boardArray.flat().filter((item) => item === "□").length;
  };

  updateBoard = function (newboardArray) {
    boardArray = newboardArray;
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
  let boardArray = getBoardArray();
  let currentTurn = Math.random() >= 0.5 ? "X" : "O";
  let gameOutcome = {
    gameStatus: "Ongoing",
    gameVictor: undefined,
  };

  getCurrentTurn = () => currentTurn;

  switchPlayerTurn = () => {
    currentTurn = currentTurn === "X" ? "O" : "X";
  };

  setGameOutcome = () => {
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
    } else if (getRemainingCells() == 0) {
      console.log("DRAW");
      gameOutcome.gameStatus = "Draw";
    } else {
      console.log("ONGOING MATCH");
      console.log(mainDiagonal);
    }
  };

  getGameOutcome = () => gameOutcome;

  return {
    getCurrentTurn,
    switchPlayerTurn,
    setGameOutcome,
    getGameOutcome,
  };
})(gameBoard);

gameController.setGameOutcome();
