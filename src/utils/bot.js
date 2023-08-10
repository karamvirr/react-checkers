import {
  isObjectEmpty,
  getMoves,
  getPlayerPiecesCount,
  getOpponentPiecesCount,
  jumpOpportunityExists
} from './index.js';

const MAX_SEARCH_DEPTH = 4;
const MAX_REWARD = 1000000;
const CAPTURE_REWARD = 50000;
const KING_REWARD = 5000;
const PIECE_REWARD = 1000;
const DEPTH_PENALTY = 50; // per depth level

const calculateBestMove = (board, isPlayer, mandatoryJumpFrom = {}) => {
  const updatedBoard = [...board];
  let bestMoves = [];
  // Bot is maximizing player, user is minimizing player.
  const isMaximizing = isPlayer ? false : true;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  if (isObjectEmpty(mandatoryJumpFrom)) {
    for (let row = 0; row < updatedBoard.length; row++) {
      for (let column = 0; column < updatedBoard[row].length; column++) {
        if (
          updatedBoard[row][column] &&
          updatedBoard[row][column].isPlayer === isPlayer
        ) {
          const piece = updatedBoard[row][column];
          const moves = getMoves(updatedBoard, row, column);
          moves.forEach(move => {
            const capturedPiece = move.capturedPiece
              ? updatedBoard[move.capturedPiece.row][move.capturedPiece.column]
              : null;
            // choose
            applyMove(
              updatedBoard,
              { row: row, column: column },
              move,
              piece,
              capturedPiece
            );
            // explore
            let score = minimax(
              updatedBoard,
              0,
              capturedPiece ? isMaximizing : !isMaximizing
            );
            if (capturedPiece) {
              if (isPlayer) {
                score -= CAPTURE_REWARD;
              } else {
                score += CAPTURE_REWARD;
              }
            }
            // unchoose
            undoMove(
              updatedBoard,
              { row: row, column: column },
              move,
              piece,
              capturedPiece
            );

            if (isMaximizing ? score > bestScore : score < bestScore) {
              bestScore = score;
              bestMoves = [
                {
                  from: { row: row, column: column },
                  to: { ...move },
                  capturedPiece: move.capturedPiece
                }
              ];
            } else if (score === bestScore) {
              bestMoves.push({
                from: { row: row, column: column },
                to: { ...move },
                capturedPiece: move.capturedPiece
              });
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
    moves.forEach(move => {
      const capturedPiece = move.capturedPiece
        ? board[move.capturedPiece.row][move.capturedPiece.column]
        : null;
      // choose
      applyMove(
        updatedBoard,
        { row: row, column: column },
        move,
        piece,
        capturedPiece
      );
      // explore
      let score = minimax(
        updatedBoard,
        0,
        capturedPiece ? isMaximizing : !isMaximizing
      );
      if (capturedPiece) {
        if (isPlayer) {
          score -= CAPTURE_REWARD;
        } else {
          score += CAPTURE_REWARD;
        }
      }
      // unchoose
      undoMove(
        updatedBoard,
        { row: row, column: column },
        move,
        piece,
        capturedPiece
      );

      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMoves = [
          {
            from: { row: row, column: column },
            to: { ...move },
            capturedPiece: move.capturedPiece
          }
        ];
      } else if (score === bestScore) {
        bestMoves.push({
          from: { row: row, column: column },
          to: { ...move },
          capturedPiece: move.capturedPiece
        });
      }
    });
  }

  const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  console.log('score', bestScore, 'move', bestMove, 'player', isPlayer);
  return bestMove;
};

const minimax = (board, depth, isMaximizing) => {
  const playerPiecesCount = getPlayerPiecesCount(board);
  const opponentPiecesCount = getOpponentPiecesCount(board);
  if (playerPiecesCount === 0) {
    return MAX_REWARD - DEPTH_PENALTY * depth;
  } else if (opponentPiecesCount === 0) {
    return -MAX_REWARD + DEPTH_PENALTY * depth;
  } else if (opponentPiecesCount === 0 && playerPiecesCount === 0) {
    return 0;
  } else if (depth == MAX_SEARCH_DEPTH) {
    const sign = isMaximizing ? -1 : 1;
    return evaluateBoard(board) + sign * DEPTH_PENALTY * depth;
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        if (
          board[row][column] &&
          board[row][column].isPlayer !== undefined &&
          !board[row][column].isPlayer
        ) {
          const piece = board[row][column];
          const moves = getMoves(board, row, column);
          moves.forEach(move => {
            const capturedPiece = move.capturedPiece
              ? board[move.capturedPiece.row][move.capturedPiece.column]
              : null;

            // choose
            applyMove(
              board,
              { row: row, column: column },
              move,
              piece,
              capturedPiece
            );
            // explore
            let score = minimax(board, depth + 1, capturedPiece ? true : false);
            if (capturedPiece) {
              score += CAPTURE_REWARD;
            }
            // unchoose
            undoMove(
              board,
              { row: row, column: column },
              move,
              piece,
              capturedPiece
            );

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
      if (
        board[row][column] &&
        board[row][column].isPlayer !== undefined &&
        board[row][column].isPlayer
      ) {
        const piece = board[row][column];
        const moves = getMoves(board, row, column);
        moves.forEach(move => {
          const capturedPiece = move.capturedPiece
            ? board[move.capturedPiece.row][move.capturedPiece.column]
            : null;

          // choose
          applyMove(
            board,
            { row: row, column: column },
            move,
            piece,
            capturedPiece
          );
          // explore
          let score = minimax(board, depth + 1, capturedPiece ? false : true);
          if (capturedPiece) {
            score -= CAPTURE_REWARD;
          }
          // unchoose
          undoMove(
            board,
            { row: row, column: column },
            move,
            piece,
            capturedPiece
          );

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

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell) {
        const sign = cell.isPlayer ? -1 : 1;
        score += sign * (cell.isKing ? KING_REWARD : PIECE_REWARD);
        if (jumpOpportunityExists(board, rowIndex, columnIndex)) {
          score += sign * CAPTURE_REWARD;
        }
      }
    });
  });

  return score;
};

export { calculateBestMove };
