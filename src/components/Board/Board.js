import classes from './Board.module.css';
import Piece from '../Piece';
import { useState } from 'react';
import { getMoves, isObjectEmpty } from '../../utils';

const Board = (props) => {
  const [currentMove, setCurrentMove] = useState({});
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const pieceSelectionHandler = (row, column) => {
    if (props.isPlayersTurn && !currentMove.isMandatory) {
      setCurrentMove({ from: { row: row, column: column } });
      setHighlightedSquares(getMoves(props.board, row, column));
    }
  };

  const isHighlightedSquare = (row, column) => {
    return highlightedSquares.some((square) => {
      return square.row === row && square.column === column;
    })
  };

  const selectMoveHandler = (row, column) => {
    const destinationSquare = highlightedSquares.find((square) => {
      return square.row === row && square.column === column;
    })
    if (destinationSquare) {
      props.updateBoard({
        ...currentMove,
        to: { row: row, column: column },
        capturedPiece: destinationSquare.capturedPiece
      });
      setCurrentMove({});
      setHighlightedSquares([]);
    }
  };

  const data = props.board.map((row, rowIndex) => {
    const rowKey = `row${rowIndex}`;
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
          if (isObjectEmpty(currentMove) && !isObjectEmpty(props.mandatoryJump)) {
            setCurrentMove(props.mandatoryJump);
            setHighlightedSquares(getMoves(props.board, props.mandatoryJump.from.row, props.mandatoryJump.from.column));
          }
          const cell = props.board[rowIndex][columnIndex];
          return (
            <div onClick={() => { selectMoveHandler(rowIndex, columnIndex) }} className={classList} key={columnKey}>
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
