import classes from './Board.module.css';
import Piece from '../Piece';
import { useState } from 'react';
import { getMoves, isGameOver } from '../../utils';

const Board = (props) => {
  const [currentMove, setCurrentMove] = useState({});
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const pieceSelectionHandler = (row, column) => {
    if (isGameOver(props.board)) {
      return;
    }
    if (props.isPlayersTurn && !currentMove.isMandatory && props.board[row][column].isPlayer) {
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
    });

    if (currentMove.from && destinationSquare) {
      props.updateBoard({
        ...currentMove,
        to: { row: row, column: column },
        capturedPiece: destinationSquare.capturedPiece
      });

      if (destinationSquare.capturedPiece) {
        const additionalJumpOpportunities = getMoves(
          props.board, destinationSquare.row, destinationSquare.column
        ).filter(move => move.capturedPiece);
        if (additionalJumpOpportunities.length > 0) {
          setCurrentMove({
            from: { row: destinationSquare.row, column: destinationSquare.column },
            isMandatory: true
          });
          setHighlightedSquares(additionalJumpOpportunities);
          return;
        }
      }
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
