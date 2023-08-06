import classes from './Board.module.css';
import Piece from '../Piece';
import Square from '../Square';
import { useState } from 'react';
import { getMoves, isGameOver } from '../../utils';

const Board = (props) => {
  const [currentMove, setCurrentMove] = useState({});
  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const pieceSelectionHandler = (row, column) => {
    if (isGameOver(props.board)) {
      return;
    }
    if (
      props.isPlayersTurn &&
      !currentMove.isMandatory &&
      props.board[row][column].isPlayer
    ) {
      setCurrentMove({ from: { row: row, column: column } });
      setHighlightedSquares(getMoves(props.board, row, column));
    }
  };

  const isHighlightedSquare = (row, column) => {
    return highlightedSquares.some((square) => {
      return square.row === row && square.column === column;
    });
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
          props.board,
          destinationSquare.row,
          destinationSquare.column
        ).filter(move => move.capturedPiece);
        if (additionalJumpOpportunities.length > 0) {
          setCurrentMove({
            from: {
              row: destinationSquare.row,
              column: destinationSquare.column
            },
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
      <div
        className={classes['board__row']}
        key={rowKey}>
        {row.map((_, columnIndex) => {
          const squareKey = `row${rowIndex}col${columnIndex}`;
          const cell = props.board[rowIndex][columnIndex];

          return (
            <Square
              onClick={() => {
                selectMoveHandler(rowIndex, columnIndex);
              }}
              alternatePattern={columnIndex % 2 === alternatingPatternFlag}
              isHighlighted={isHighlightedSquare(rowIndex, columnIndex)}
              key={squareKey}>
              {cell ? (
                <Piece
                  row={rowIndex}
                  column={columnIndex}
                  isPlayer={cell.isPlayer}
                  isKing={cell.isKing}
                  pieceSelectionHandler={pieceSelectionHandler}
                />
              ) : null}
            </Square>
          );
        })}
      </div>
    );
  });

  return <div className={classes.board}>{data}</div>;
};

export default Board;
