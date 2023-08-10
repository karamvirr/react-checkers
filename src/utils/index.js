// Returns true if the given value is an object and has no properties
// defined, otherwise returns false.
//
// @param {object} value - object to check
const isObjectEmpty = value => {
  return Object.keys(value).length === 0 && value.constructor === Object;
};

// Returns the number of pieces on the board that belong to the player.
//
// @param {array} board - a 2D array representing the board
const getPlayerPiecesCount = board => {
  let count = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell && cell.isPlayer) {
        count++;
      }
    });
  });
  return count;
};

// Returns the number of pieces on the board that belong to the opponent (AI).
//
// @param {array} board - a 2D array representing the board
const getOpponentPiecesCount = board => {
  let count = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell && !cell.isPlayer) {
        count++;
      }
    });
  });
  return count;
};

// Returns true if the game is over, otherwise returns false.
// The game is over when one (or both) of the players has no pieces left.
//
// @param {array} board - a 2D array representing the board
const isGameOver = board => {
  return (
    getPlayerPiecesCount(board) === 0 || getOpponentPiecesCount(board) === 0
  );
};

// Returns an array of all possible moves for the given piece based on the row
// and column provided as parameters. It will also include information on captured
// pieces if the move is a jump.
// e.x., [{ row: 1, column: 0 }, { row: 2, column: 3, capturedPiece: { row: 1, column: 2 }}]
//
// @param {array} board - a 2D array representing the board
// @param {number} row - row of the piece
// @param {number} column - column of the piece
const getMoves = (board, row, column) => {
  const moves = [];

  const { isPlayer, isKing } = board[row][column];

  if (board[row - 1] && (isPlayer || isKing)) {
    const topLeftSquare = board[row - 1][column - 1];
    const topRightSquare = board[row - 1][column + 1];

    if (topLeftSquare === null) {
      moves.push({ row: row - 1, column: column - 1 });
    } else if (topLeftSquare && topLeftSquare.isPlayer != isPlayer) {
      // top left square is taken by opponent
      if (board[row - 2] && board[row - 2][column - 2] === null) {
        // jump opportunity
        moves.push({
          row: row - 2,
          column: column - 2,
          capturedPiece: { row: row - 1, column: column - 1 }
        });
      }
    }

    if (topRightSquare === null) {
      moves.push({ row: row - 1, column: column + 1 });
    } else if (topRightSquare && topRightSquare.isPlayer != isPlayer) {
      // top right square is taken by opponent
      if (board[row - 2] && board[row - 2][column + 2] === null) {
        // jump opportunity
        moves.push({
          row: row - 2,
          column: column + 2,
          capturedPiece: { row: row - 1, column: column + 1 }
        });
      }
    }
  }

  if (board[row + 1] && (!isPlayer || isKing)) {
    const bottomLeftSquare = board[row + 1][column - 1];
    const bottomRightSquare = board[row + 1][column + 1];

    if (bottomLeftSquare === null) {
      moves.push({ row: row + 1, column: column - 1 });
    } else if (bottomLeftSquare && bottomLeftSquare.isPlayer != isPlayer) {
      // bottom left square is taken by opponent
      if (board[row + 2] && board[row + 2][column - 2] === null) {
        // jump opportunity
        moves.push({
          row: row + 2,
          column: column - 2,
          capturedPiece: { row: row + 1, column: column - 1 }
        });
      }
    }

    if (bottomRightSquare === null) {
      moves.push({ row: row + 1, column: column + 1 });
    } else if (bottomRightSquare && bottomRightSquare.isPlayer != isPlayer) {
      // bottom right square is taken by opponent
      if (board[row + 2] && board[row + 2][column + 2] === null) {
        /// jump opportunity
        moves.push({
          row: row + 2,
          column: column + 2,
          capturedPiece: { row: row + 1, column: column + 1 }
        });
      }
    }
  }

  return moves;
};

// Returns true if the given piece has a jump opportunity, otherwise returns false.
//
// @param {array} board - a 2D array representing the board
// @param {number} row - row of the piece
// @param {number} column - column of the piece
const jumpOpportunityExists = (board, row, column) => {
  return getMoves(board, row, column).some(move => move.capturedPiece);
};

export {
  getMoves,
  getPlayerPiecesCount,
  getOpponentPiecesCount,
  isObjectEmpty,
  isGameOver,
  jumpOpportunityExists
};
