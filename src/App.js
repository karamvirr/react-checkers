import Board from './components/Board';
import { useState, useEffect } from 'react';
import { applyBestMove } from './utils/bot';

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

  useEffect(() => {
    if (!isPlayersTurn) {
      // AI's turn
      const boardCopy = [...board];
      //getBestMove(boardCopy);
    }
  }, [isPlayersTurn]);

  const boardUpdateHandler = ({ from, to, jumpedOver }) => {
    console.log(from, to, jumpedOver);
    if (jumpedOver) {
      board[jumpedOver.row][jumpedOver.column] = null;
    }
    board[to.row][to.column] = board[from.row][from.column];
    board[from.row][from.column] = null;
    if (to.row === 0 || to.row === (board.length - 1)) {
      board[to.row][to.column].isKing = true;
    }
    setBoard(board);
    //setIsPlayersTurn(previousState => !previousState);
  };

  return (
    <main>
      <Board board={board} isPlayersTurn={isPlayersTurn} updateBoard={boardUpdateHandler}/>
    </main>
  );
};

export default App;
