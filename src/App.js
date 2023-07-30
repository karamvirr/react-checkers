import Board from './components/Board';
import { useState, useEffect } from 'react';
import { getPlayerPiecesCount, getOpponentPiecesCount, getMoves } from './utils';

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
  const [isPlayersTurn, setIsPlayersTurn] = useState(true);
  const [mandatoryJump, setMandatoryJump] = useState({});

  useEffect(() => {
    const playerPieceCount = getPlayerPiecesCount(board);
    const opponentPieceCount = getOpponentPiecesCount(board);
    console.log(playerPieceCount, opponentPieceCount);
    if (playerPieceCount === 0 || opponentPieceCount === 0) {
      if (playerPieceCount === 0) {
        alert('Game over, you lost!');
      } else {
        alert('Game over, you won!');
      }
      setBoard(initializeBoard());
      setIsPlayersTurn(true);
    } else {
      if (!isPlayersTurn) {
        // AI's turn
        const boardCopy = [...board];
        //getBestMove(boardCopy);
      }
      //setIsPlayersTurn(previousState => !previousState);
    }
  }, [board]);

  const boardUpdateHandler = ({ from, to, capturedPiece }) => {
    board[to.row][to.column] = board[from.row][from.column];
    board[from.row][from.column] = null;

    if (to.row === 0 || to.row === (board.length - 1)) {
      board[to.row][to.column].isKing = true;
    }
    if (capturedPiece) {
      board[capturedPiece.row][capturedPiece.column] = null;
      if (getMoves(board, to.row, to.column).some(m => m.capturedPiece)) {
        setMandatoryJump({ isMandatory: true, from: { row: to.row, column: to.column } });
      } else {
        setMandatoryJump({});
      }
    }

    setBoard([...board]);
  };

  return (
    <main>
      <Board board={board} isPlayersTurn={isPlayersTurn} updateBoard={boardUpdateHandler} mandatoryJump={mandatoryJump} />
    </main>
  );
};

export default App;
