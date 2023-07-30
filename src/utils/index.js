const getMoves = (board, row, column) => {
  const { isPlayer, isKing } = board[row][column];
  const moves = [];

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
          jumpedOver: { row: row - 1, column: column - 1 }
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
          jumpedOver: { row: row - 1, column: column + 1 }
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
          jumpedOver: { row: row + 1, column: column - 1 }
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
          jumpedOver: { row: row + 1, column: column + 1 }
        });
      }
    }
  }

  return moves;
};

export { getMoves };
