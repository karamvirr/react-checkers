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
  if (!board[row][column]) {
    return moves;
  }

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

const applyBestMove = (board, isPlayersTurn) => {
  const updatedBoard = [...board];
  let bestMoves = [];
  let bestScore = -Infinity;
  for (let row = 0; row < updatedBoard.length; row++) {
    for (let column = 0; column < updatedBoard[row].length; column++) {
      const square = updatedBoard[row][column];
      if (square && (square.isPlayer === isPlayersTurn)) {
        const moves = getMoves(updatedBoard, row, column);
        moves.forEach((move) => {
          bestMoves.push({ from: { row: row, column: column }, to: { ...move }, capturedPiece: move.capturedPiece });
        });
      }
    }
  }

  const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  return bestMove;
};

export { getMoves, getPlayerPiecesCount, getOpponentPiecesCount, isObjectEmpty, applyBestMove, isGameOver };
