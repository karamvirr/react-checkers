const isObjectEmpty = (value) => {
  return Object.keys(value).length === 0
    && value.constructor === Object;
};

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

const isGameOver = board => {
  return getPlayerPiecesCount(board) === 0 || getOpponentPiecesCount(board) === 0;
};

const getMoves = (board, row, column) => {
  const moves = [];

  const { isPlayer, isKing } = board[row][column];

  if (board[row - 1] && (isPlayer || isKing)) {
    const topLeftSquare = board[row - 1][column - 1];
    const topRightSquare = board[row - 1][column + 1];

    if (topLeftSquare === null) {
      moves.push({ row: row - 1, column: column - 1});
    } else if (topLeftSquare && topLeftSquare.isPlayer != isPlayer) {
      // top left square is taken by opponent
      if (board[row - 2] && board[row - 2][column - 2] === null) {
        // jump opportunity
        moves.push({
          row: row - 2, column: column - 2,
          capturedPiece: { row: row - 1, column: column - 1 }
        });
      }
    }

    if (topRightSquare === null) {
      moves.push({ row: row - 1, column: column + 1});
    } else if (topRightSquare && topRightSquare.isPlayer != isPlayer) {
      // top right square is taken by opponent
      if (board[row - 2] && board[row - 2][column + 2] === null) {
        // jump opportunity
        moves.push({
          row: row - 2, column: column + 2,
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
          row: row + 2, column: column - 2,
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
          row: row + 2, column: column + 2 ,
          capturedPiece: { row: row + 1, column: column + 1 }
        });
      }
    }
  }

  return moves;
};

const euclideanDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const jumpOpportunityExists = (board, row, column) => {
  return getMoves(board, row, column).some(move => move.capturedPiece);
};

export {
  getMoves,
  getPlayerPiecesCount,
  getOpponentPiecesCount,
  isObjectEmpty,
  isGameOver,
  euclideanDistance,
  jumpOpportunityExists
};
