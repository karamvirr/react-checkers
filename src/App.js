import Board from './components/Board';
import Bot from './components/Bot';
import { useState, useEffect } from 'react';
import { getPlayerPiecesCount, getOpponentPiecesCount, jumpOpportunityExists } from './utils';

const initializeBoard = () => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    const alternatingPatternFlag = (i % 2 === 0) ? 1 : 0;
    for (let j = 0; j < 8; j++) {
      let cell = null;
      if (j % 2 === alternatingPatternFlag) {
        if (i < 3) {
          cell = {
            isPlayer: false,
            isKing: false
          };
        }
        if (i > 4) {
          cell = {
            isPlayer: true,
            isKing: false
          };
        }
      }
      row.push(cell);
    }
    board.push(row);
  }

  return board;
};

const App = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [additionalJumpDetected, setAdditionalJumpDetected] = useState(false);
  const [endTurnRequested, setEndTurnRequested] = useState(false);

  useEffect(() => {
    if (endTurnRequested) {
      if (getOpponentPiecesCount(board) === 0 || getPlayerPiecesCount(board) === 0) {
        setIsGameOver(true);
      } else if (!additionalJumpDetected) {
        setIsPlayersTurn(previousState => !previousState);
      }
      setEndTurnRequested(false);
    }
  }, [endTurnRequested]);

  useEffect(() => {
    if (isGameOver) {
      const playerPieceCount = getPlayerPiecesCount(board);
      const opponentPieceCount = getOpponentPiecesCount(board);
      if (playerPieceCount === 0) {
        alert('Game over, you lost!');
      } else if (opponentPieceCount == 0) {
        alert('Game over, you won!');
      } else {
        alert('Game over, it\'s a draw!');
      }
      window.location.reload();
    }
  }, [isGameOver]);

  const boardUpdateHandler = ({ from, to, capturedPiece }) => {
    board[to.row][to.column] = board[from.row][from.column];
    board[from.row][from.column] = null;

    if (additionalJumpDetected) {
      setAdditionalJumpDetected(false);
    }
    if (to.row === 0 || to.row === (board.length - 1)) {
      board[to.row][to.column].isKing = true;
    }
    if (capturedPiece) {
      board[capturedPiece.row][capturedPiece.column] = null;
      if (jumpOpportunityExists(board, to.row, to.column)) {
        setAdditionalJumpDetected(true);
      }
    }
    setBoard([...board]);
    setEndTurnRequested(true);
  };

  return (
    <main>
      <Bot
        board={board}
        isPlayer={false}
        isPlayersTurn={isPlayersTurn}
        updateBoard={boardUpdateHandler} />
      <Board
        board={board}
        isPlayersTurn={isPlayersTurn}
        updateBoard={boardUpdateHandler} />
    </main>
  );
};

export default App;
