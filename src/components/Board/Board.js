import classes from './Board.module.css';
import Piece from '../Piece';
import { useState } from 'react';

const Board = (props) => {

  const getMoves = (row, column, isPlayer) => {
    const moves = [];
    const board = props.board;
    console.log(isPlayer);

    if (isPlayer) {
      if (board[row - 1]) {
        const topLeftTile = board[row - 1][column - 1];
        if (topLeftTile == null) {
          moves.push({ row: row - 1, column: column - 1});
        } else if (!topLeftTile.isPlayer) {
          // opponent tile
          if (board[row - 2] && (board[row - 2][column - 2] == null)) {
            moves.push({ row: row - 2, column: column - 2, jumpedOver: { row: row - 1, column: column - 1}}); // jump opportunity
          }
        }

        const topRightTile = board[row - 1][column + 1];
        if (topRightTile == null) {
          moves.push({ row: row - 1, column: column + 1})
        } else if (!topRightTile.isPlayer) {
          // opponent tile,
          if (board[row - 2] && (board[row - 2][column + 2] == null)) {
            moves.push({ row: row - 2, column: column + 2, jumpedOver: { row: row - 1, column: column + 1}}); // jump opportunity
          }
        }
      }

      if (board[row][column].isKing) {
        if (board[row + 1]) {
          const bottomLeftTile = board[row + 1][column - 1];
          if (bottomLeftTile == null) {
            moves.push({ row: row + 1, column: column - 1});
          } else if (!bottomLeftTile.isPlayer) {
            // opponent tile
            if (board[row + 2] && (board[row + 2][column - 2] == null)) {
              moves.push({ row: row + 2, column: column - 2, jumpedOver: { row: row + 1, column: column - 1} }); // jump opportunity
            }
          }

          const bottomRightTile = board[row + 1][column + 1];
          if (bottomRightTile == null) {
            moves.push({ row: row + 1, column: column + 1});
          } else if (!bottomRightTile.isPlayer) {
            // opponent tile
            if (board[row + 2] && (board[row + 2][column + 2] == null)) {
              moves.push({ row: row + 2, column: column + 2, jumpedOver: { row: row + 1, column: column + 1} }); // jump opporunity
            }
          }
        }
      }
    } else {
      if (board[row + 1]) {
        const bottomLeftTile = board[row + 1][column - 1];
        if (bottomLeftTile == null) {
          moves.push({ row: row + 1, column: column - 1});
        } else if (bottomLeftTile.isPlayer) {
          if (board[row + 2] && (board[row + 2][column - 2] == null)) {
            moves.push({ row: row + 2, column: column - 2, jumpedOver: { row: row + 1, column: column - 1} }); // jump opportunity
          }
        }

        const bottomRightTile = board[row + 1][column + 1];
        if (bottomRightTile == null) {
          moves.push({ row: row + 1, column: column + 1});
        } else if (bottomRightTile.isPlayer) {
          if (board[row + 2] && (board[row + 2][column + 2] == null)) {
            moves.push({ row: row + 2, column: column + 2, jumpedOver: { row: row + 1, column: column + 1} }); // jump opporunity
          }
        }
      }

      if (board[row][column].isKing) {
        if (board[row - 1]) {
          const topLeftTile = board[row - 1][column - 1];
          if (topLeftTile == null) {
            moves.push({ row: row - 1, column: column - 1});
          } else if (topLeftTile.isPlayer) {
            if (board[row - 2] && (board[row - 2][column - 2] == null)) {
              moves.push({ row: row - 2, column: column - 2, jumpedOver: { row: row - 1, column: column - 1}}); // jump opportunity
            }
          }

          const topRightTile = board[row - 1][column + 1];
          if (topRightTile == null) {
            moves.push({ row: row - 1, column: column + 1})
          } else if (topRightTile.isPlayer) {
            if (board[row - 2] && (board[row - 2][column + 2] == null)) {
              moves.push({ row: row - 2, column: column + 2, jumpedOver: { row: row - 1, column: column + 1}}); // jump opportunity
            }
          }
        }
      }
    }

    return moves;
  }

  const tileSelectionHandler = (rowIndex, columnIndex) => {
    if (highlightedTiles.some(tile => tile.row == rowIndex && tile.column == columnIndex)) {
      let selectedPiece = props.board[start.row][start.column];
      selectedPiece.row = rowIndex; // ugh
      selectedPiece.column = columnIndex;

      if (rowIndex === 0 && selectedPiece.isPlayer && !selectedPiece.isKing) {
        selectedPiece.isKing = true;
      }
      if (rowIndex === (props.board.length - 1) && !selectedPiece.isPlayer && !selectedPiece.isKing) {
        selectedPiece.isKing = true;
      }

      props.board[rowIndex][columnIndex] = selectedPiece;
      props.board[start.row][start.column] = null;

      const selectedTile = highlightedTiles.filter(tile => tile.row == rowIndex && tile.column == columnIndex)[0];
      if (selectedTile.jumpedOver) {
        props.board[selectedTile.jumpedOver.row][selectedTile.jumpedOver.column] = null;
      }

      setStart({});
      setHighLightedTiles([]);
      // props.toggleTurn();
      // check for mandatory jumps
      // ai turn
    }
  };

  const handlePieceClickHandler = (row, column, isPlayer) => {
    console.log(row, column);
    setStart({ row: row, column: column });
    setHighLightedTiles(getMoves(row, column, isPlayer));
  };

  const [highlightedTiles, setHighLightedTiles] = useState([]);
  const [start, setStart] = useState({});
  const [end, setEnd] = useState({});

  const data = props.board.map((row, rowIndex) => {
    const rowKey = `row${rowIndex}`;
    let alternatingIndex = (rowIndex % 2 === 0) ? 1 : 0;
    return (
      <div className={classes['board__row']} key={rowKey}>
        {row.map((column, columnIndex) => {
          const columnKey = `row${rowIndex}col${columnIndex}`;
          let classList = classes['board__square'];
          if (alternatingIndex == columnIndex) {
            classList += ` ${classes['board__square--alternating']}`;
            alternatingIndex += 2;
          }
          if (highlightedTiles.length > 0) {
            const isHighlited = highlightedTiles.some(tile => tile.row == rowIndex && tile.column == columnIndex);
            if (isHighlited) {
              classList += ` ${classes['board__square--highlighted']}`;
            }
          }
          const cell = props.board[rowIndex][columnIndex];
          return (
            <div onClick={() => { tileSelectionHandler(rowIndex, columnIndex) }} className={classList} key={columnKey}>
              {cell ? <Piece onClick={handlePieceClickHandler} row={cell.row} column={cell.column} isPlayer={cell.isPlayer} isKing={cell.isKing} /> : null}
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
