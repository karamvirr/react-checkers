import classes from './Board.module.css';
import Piece from '../Piece';
import { useState } from 'react';
import { getMoves } from '../../utils';
import Square from '../Square/Square';

const Board = (props) => {
  const [move, setMove] = useState({});
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const pieceSelectionHandler = (row, column) => {
    if (props.isPlayersTurn) {
      setMove({ from: { row: row, column: column } });
      console.log(getMoves(props.board, row, column));
      setHighlightedSquares(getMoves(props.board, row, column));
    }
  };

  const isHighlightedSquare = (row, column) => {
    return highlightedSquares.some((square) => {
      return square.row === row && square.column === column;
    })
  };

  const movePieceHandler = (row, column) => {
    const destinationSquare = highlightedSquares.find((square) => {
      return square.row === row && square.column === column;
    })
    if (destinationSquare) {
      // TODO: handle case where user can make consecutive jumps on one turn.
      props.updateBoard({
        ...move,
        to: { row: row, column: column },
        jumpedOver: destinationSquare.jumpedOver
      });
      setMove({});
      setHighlightedSquares([]);
    }
  };

  const data = props.board.map((row, rowIndex) => {
    const rowKey = `row${rowIndex}`;
    // let alternatingIndex = (rowIndex % 2 === 0) ? 1 : 0;
    const alternatingPatternFlag = (rowIndex % 2 === 0) ? 1 : 0;
    return (
      <div className={classes['board__row']} key={rowKey}>
        {row.map((_, columnIndex) => {
          const columnKey = `row${rowIndex}col${columnIndex}`;
          let classList = classes['board__square'];

          if (columnIndex % 2 === alternatingPatternFlag) {
            classList += ` ${classes['board__square--alternating']}`;
          }

          if (isHighlightedSquare(rowIndex, columnIndex)) {
            classList += ` ${classes['board__square--highlighted']}`;
          }
          const cell = props.board[rowIndex][columnIndex];
          return (
            <div onClick={() => { movePieceHandler(rowIndex, columnIndex) }} className={classList} key={columnKey}>
              {cell ? <Piece row={rowIndex} column={columnIndex} isPlayer={cell.isPlayer} isKing={cell.isKing} pieceSelectionHandler={pieceSelectionHandler} /> : null}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className={classes.board}>
      {data}
    </div>
  );
};

export default Board; 
