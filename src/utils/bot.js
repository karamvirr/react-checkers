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
const JUMP_OPPORTUNITY_REWARD = 10000;
const KING_REWARD = 5000;
const PIECE_REWARD = 1000;
const DEPTH_PENALTY = 50; // per depth level

// Computes and returns the best move to make for the given board.
// e.x., { from: { row: 2, column: 1 }, to: { row: 3, column: 0 } }
//
// @param {array} board - a 2D array representing the board
// @param {boolean} isPlayer - true if the bot is the player, otherwise false
// @param {object} mandatoryJumpFrom - starting position of the mandatory jump
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
              score = isPlayer
                ? score - CAPTURE_REWARD
                : score + CAPTURE_REWARD;
              if (jumpOpportunityExists(board, move.row, move.column)) {
                score = isPlayer
                  ? score - JUMP_OPPORTUNITY_REWARD
                  : score + JUMP_OPPORTUNITY_REWARD;
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
        score = isPlayer ? score - CAPTURE_REWARD : score + CAPTURE_REWARD;
        if (jumpOpportunityExists(board, move.row, move.column)) {
          score = isPlayer
            ? score - JUMP_OPPORTUNITY_REWARD
            : score + JUMP_OPPORTUNITY_REWARD;
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

// Uses the minimax algorithm to compute the best score for the given board.
// source: https://en.wikipedia.org/wiki/Minimax
//
// @param {array} board - a 2D array representing the board
// @param {number} depth - the current depth level
// @param {boolean} isMaximizing - true if maximizing move score, otherwise false
//                                 if maximizing, it means we are looking for
//                                 the most optimal move for the opponent bot.
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
          const score = evaluatePiece(
            board,
            row,
            column,
            depth + 1,
            isMaximizing
          );
          maxScore = Math.max(maxScore, score);
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
        const score = evaluatePiece(
          board,
          row,
          column,
          depth + 1,
          isMaximizing
        );
        minScore = Math.min(score, minScore);
      }
    }
  }
  return minScore;
};

// Applies the given move to the board. Also handles capturing
// a piece if the move is a jump.
//
// @param {array} board - a 2D array representing the board
// @param {object} from - the piece's current position
// @param {object} move - the piece's new position
// @param {object} piece - the piece object
const applyMove = (board, from, move, piece) => {
  board[move.row][move.column] = piece;
  board[from.row][from.column] = null;
  if (move.capturedPiece) {
    board[move.capturedPiece.row][move.capturedPiece.column] = null;
  }
};

// Undoes the given move to the board. Also handles restoring
// a captured piece if the move is a jump.
//
// @param {array} board - a 2D array representing the board
// @param {object} from - the piece's current position
// @param {object} move - the piece's new position
// @param {object} piece - the piece object
const undoMove = (board, from, move, piece, capturedPiece) => {
  board[move.row][move.column] = null;
  board[from.row][from.column] = piece;
  if (move.capturedPiece && capturedPiece) {
    board[move.capturedPiece.row][move.capturedPiece.column] = capturedPiece;
  }
};

// Evaluates and returns the given piece's score based on the given board.
//
// @param {array} board - a 2D array representing the board
// @param {number} row - the piece's current row
// @param {number} column - the piece's current column
// @param {number} depth - the current depth level
// @param {boolean} isMaximizing - true if maximizing move score, otherwise false
//                                 if maximizing, it means we are looking for
//                                 the most optimal move for the opponent bot.
const evaluatePiece = (board, row, column, depth, isMaximizing) => {
  const piece = board[row][column];
  const moves = getMoves(board, row, column);
  let bestScore = isMaximizing ? -Infinity : Infinity;

  moves.forEach(move => {
    const capturedPiece = move.capturedPiece
      ? board[move.capturedPiece.row][move.capturedPiece.column]
      : null;

    // choose
    applyMove(board, { row: row, column: column }, move, piece, capturedPiece);
    // explore
    let score = minimax(
      board,
      depth + 1,
      capturedPiece ? isMaximizing : !isMaximizing
    );
    if (capturedPiece) {
      score = isMaximizing ? score + CAPTURE_REWARD : score - CAPTURE_REWARD;
      if (jumpOpportunityExists(board, move.row, move.column)) {
        score = isMaximizing
          ? score + JUMP_OPPORTUNITY_REWARD
          : score - JUMP_OPPORTUNITY_REWARD;
      }
    }

    // unchoose
    undoMove(board, { row: row, column: column }, move, piece, capturedPiece);

    const func = isMaximizing ? Math.max : Math.min;
    bestScore = func(bestScore, score);
  });

  return bestScore;
};

// Heuristic function that evaluates the board and returns a score.
// The more positive the score, the better the board is for the opponent AI.
// The more negative the score, the better the board is for the player.
//
// @param {array} board - a 2D array representing the board
const evaluateBoard = board => {
  let score = 0;

  board.forEach((row, rowIndex) => {
    row.forEach((square, columnIndex) => {
      if (square) {
        const piece = square;
        const sign = piece.isPlayer ? -1 : 1;
        score += sign * (piece.isKing ? KING_REWARD : PIECE_REWARD);
        if (jumpOpportunityExists(board, rowIndex, columnIndex)) {
          score += sign * CAPTURE_REWARD;
        }
      }
    });
  });

  return score;
};

export { calculateBestMove };
