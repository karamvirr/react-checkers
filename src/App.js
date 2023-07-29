import Board from './components/Board';
import { useState, useEffect } from 'react';
import { applyBestMove } from './utils/bot';

const initializeBoard = () => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    let alternatingIndex = (i % 2 === 0) ? 1 : 0;
    for (let j = 0; j < 8; j++) {
      let cell = null;
      if (alternatingIndex == j) {
        alternatingIndex += 2;
        if (i < 3) {
          cell = {
            isPlayer: false,
            isKing: false,
            row: i,
            column: j,
          };
        }
        if (i > 4) {
          cell = {
            isPlayer: true,
            isKing: false,
            row: i,
            column: j
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
  const [playersTurn, setPlayersTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  console.log('board', board);

  const toggleTurn = () => {
    setPlayersTurn(previousState => !previousState);
  }
  return (
    <main>
      <Board board={board} isPlayerTurn={playersTurn} toggleTurn={toggleTurn} />
    </main>
  );
};

export default App;
