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

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");