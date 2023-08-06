import {
  isObjectEmpty,
  getMoves,
  getPlayerPiecesCount,
  getOpponentPiecesCount,
  euclideanDistance
} from './index.js';

const MAX_SEARCH_DEPTH = 5;
const MAX_REWARD = 1000000;
const CAPTURE_BONUS = 50000;
const KING_REWARD = 1000;
const PIECE_REWARD = 100;

const calculateBestMove = (board, mandatoryJumpFrom = {}) => {
  const updatedBoard = [...board];
  let bestMoves = [];
  let bestScore = -Infinity;

  if (isObjectEmpty(mandatoryJumpFrom)) {
    for (let row = 0; row < updatedBoard.length; row++) {
      for (let column = 0; column < updatedBoard[row].length; column++) {
        if (updatedBoard[row][column] && !updatedBoard[row][column].isPlayer) {
          const piece = updatedBoard[row][column];
          const moves = getMoves(updatedBoard, row, column);
          moves.forEach((move) => {
            const capturedPiece = move.capturedPiece ? updatedBoard[move.capturedPiece.row][move.capturedPiece.column] : null;
            // choose
            applyMove(updatedBoard, { row: row, column: column }, move, piece, capturedPiece);
            // explore
            let score = minimax(updatedBoard, 0, false);
            if (capturedPiece) {
              score += CAPTURE_BONUS;
            }
            // unchoose
            undoMove(updatedBoard, { row: row, column: column }, move, piece, capturedPiece);

            if (score > bestScore) {
              bestScore = score;
              bestMoves = [{ from: { row: row, column: column }, to: { ...move }, capturedPiece: move.capturedPiece }];
            } else if (score === bestScore) {
              bestMoves.push({ from: { row: row, column: column }, to: { ...move }, capturedPiece: move.capturedPiece });
            }
          });
        }
      }
    }
  } else {
    const row = mandatoryJumpFrom.row;
    const column = mandatoryJumpFrom.column;
    const piece = updatedBoard[row][column];
    const moves = getMoves(updatedBoard, row, column);
    moves.forEach((move) => {
      const capturedPiece = move.capturedPiece ? board[move.capturedPiece.row][move.capturedPiece.column] : null;
      // choose
      applyMove(updatedBoard, { row: row, column: column }, move, piece, capturedPiece);
      // explore
      let score = minimax(updatedBoard, 0, false);
      if (capturedPiece) {
        score += CAPTURE_BONUS;
      }
      // unchoose
      undoMove(updatedBoard, { row: row, column: column }, move, piece, capturedPiece);

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [{ from: { row: row, column: column }, to: { ...move }, capturedPiece: move.capturedPiece }];
      } else if (score === bestScore) {
        bestMoves.push({ from: { row: row, column: column }, to: { ...move }, capturedPiece: move.capturedPiece });
      }
    });
  }

  const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  console.log(bestScore, bestMove.from, bestMove.to, bestMove.capturedPiece, bestMoves);
  return bestMove;
};


const minimax = (board, depth, isMaximizing) => {
  const playerPiecesCount = getPlayerPiecesCount(board);
  const opponentPiecesCount = getOpponentPiecesCount(board);
  if (playerPiecesCount === 0) {
    return MAX_REWARD;
  } else if (opponentPiecesCount === 0) {
    return -MAX_REWARD;
  } else if (opponentPiecesCount === 0 && playerPiecesCount === 0) {
    return 0;
  } else if (depth == MAX_SEARCH_DEPTH) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        if (board[row][column] && !board[row][column].isPlayer) {
          const piece = board[row][column];
          const moves = getMoves(board, row, column);
          moves.forEach((move) => {
            const capturedPiece = move.capturedPiece ? board[move.capturedPiece.row][move.capturedPiece.column] : null;

            // choose
            applyMove(board, { row: row, column: column }, move, piece, capturedPiece);
            // explore
            let score = minimax(board, depth + 1, false);
            if (capturedPiece) {
              score += CAPTURE_BONUS;
            }
            // unchoose
            undoMove(board, { row: row, column: column }, move, piece, capturedPiece);

            maxScore = Math.max(score, maxScore);
          });
        }
      }
    }
    return maxScore;
  }
  // minimizing
  let minScore = Infinity;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column] && board[row][column].isPlayer) {
        const piece = board[row][column];
        const moves = getMoves(board, row, column);
        moves.forEach((move) => {
          const capturedPiece = move.capturedPiece ? board[move.capturedPiece.row][move.capturedPiece.column] : null;

          // choose
          applyMove(board, { row: row, column: column }, move, piece, capturedPiece);
          // explore
          let score = minimax(board, depth + 1, true);
          if (capturedPiece) {
            score -= CAPTURE_BONUS;
          }
          // unchoose
          undoMove(board, { row: row, column: column }, move, piece, capturedPiece);

          minScore = Math.min(score, minScore);
        });
      }
    }
  }
  return minScore;
};

const applyMove = (board, from, move, piece) => {
  board[move.row][move.column] = piece;
  board[from.row][from.column] = null;
  if (move.capturedPiece) {
    board[move.capturedPiece.row][move.capturedPiece.column] = null;
  }
};

const undoMove = (board, from, move, piece, capturedPiece) => {
  board[move.row][move.column] = null;
  board[from.row][from.column] = piece;
  if (move.capturedPiece && capturedPiece) {
    board[move.capturedPiece.row][move.capturedPiece.column] = capturedPiece;
  }
};


const evaluateBoard = board => {
  let score = 0;
  let lastPlayerPiece = [];
  let lastOpponentPiece = [];
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column]) {
        const piece = board[row][column];
        if (piece.isPlayer) {
          lastPlayerPiece = [row, column];
          score -= piece.isKing ? KING_REWARD : PIECE_REWARD;
        } else {
          lastOpponentPiece = [row, column];
          score += piece.isKing ? KING_REWARD : PIECE_REWARD;
        }
        if ((lastPlayerPiece.length > 0)  && (lastOpponentPiece.length > 0)) {
          score += euclideanDistance(...lastOpponentPiece, ...lastPlayerPiece);
          lastOpponentPiece = [];
          lastPlayerPiece = [];
        }
      }
    }
  }
  board.forEach(row => {
    row.forEach(cell => {
      if (cell) {
        if (cell.isPlayer) {

          score -= cell.isKing ? KING_REWARD : PIECE_REWARD;
        } else {
          score += cell.isKing ? KING_REWARD : PIECE_REWARD;
        }
      }
    });
  });
  return score;
};

export { calculateBestMove };
