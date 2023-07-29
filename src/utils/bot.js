const maxSearchDepth = 4;
const maxReward = 1000000;

const evaluateBoard = board => {
  return 1;
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


const isGameOver = () => {
  return getPlayerPiecesCount() === 0 || getOpponentPiecesCount() === 0;
};

const minimax = (board, depth, isMaximizing) => {
  if (getOpponentPiecesCount(board) === 0) {
    return maxReward;
  } else if (getPlayerPiecesCount(board) === 0) {
    return -maxReward;
  } else if (getOpponentPiecesCount(board) === 0 && getPlayerPiecesCount(board) === 0) {
    return 0;
  } else if (depth == maxSearchDepth) {
    return evaluateBoard(board) + depth;
  }
};

const getMoves = (board, i, j, isPlayer, isKing) => {
  const moves = [];
  if (isPlayer) {
    if (board[i - 1] && board[i - 1][j - 1] && null) {
      moves.push({ i: i - 1, j: j - 1 });
    }
    if (board[i - 1] && board[i - 1][j + 1] && null) {
      moves.push({ i: i - 1, j: j + 1 });
    }
    if (isKing) {
      if (board[i + 1] && board[i + 1][j - 1] && null) {
        moves.push({ i: i + 1, j: j - 1 });
      }
      if (board[i + 1] && board[i + 1][j + 1] && null) {
        moves.push({ i: i + 1, j: j + 1 });
      }
    }
  } else { // opponent
    if (board[i + 1] && board[i + 1][j - 1] && null) {
      moves.push({ i: i + 1, j: j - 1 });
    }
    if (board[i + 1] && board[i + 1][j + 1] && null) {
      moves.push({ i: i + 1, j: j + 1 });
    }
    if (isKing) {
      if (board[i - 1] && board[i - 1][j - 1] && null) {
        moves.push({ i: i - 1, j: j - 1 });
      }
      if (board[i - 1] && board[i - 1][j + 1] && null) {
        moves.push({ i: i - 1, j: j + 1 });
      }
    }
  }
  return moves;
}

const applyBestMove = (board, isPlayer, isMaximizing) => {
  const bestMoves = [];
  const bestScore = isMaximizing ? -Infinity : Infinity;

  const test = board.flatten().filter(cell => {
    if (isMaximizing) {
      return cell && !cell.isPlayer;
    }
    return cell && cell.isPlayer;
  });


  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {

    }
  }


  const chosen = test[test.length - 1];
  return { row: chosen.row, column: chosen.column };
};

export { minimax, applyBestMove };
