import classes from './Bot.module.css';
import { jumpOpportunityExists, isObjectEmpty } from '../../utils';
import { calculateBestMove } from '../../utils/bot';
import { useEffect, useState } from 'react';

const Bot = (props) => {
  const [isComputing, setIsComputing] = useState(false);
  const [calculationTime, setCalculationTime] = useState(null);
  const [jumpFrom, setJumpFrom] = useState({});

  const executeMove = () => {
    const move = !isObjectEmpty(jumpFrom)
      ? calculateBestMove(props.board, jumpFrom)
      : calculateBestMove(props.board);
    if (move) {
      const timer = setTimeout(() => {
        clearInterval(timer);
        props.updateBoard(move);
        const additionalJumpOpportunities = jumpOpportunityExists(
          props.board,
          move.to.row,
          move.to.column
        );

        if (move.capturedPiece && additionalJumpOpportunities) {
          setJumpFrom({ row: move.to.row, column: move.to.column });
        } else if (!isObjectEmpty(jumpFrom)) {
          setJumpFrom({});
        }
        setIsComputing(false);
      }, 150);
    } else {
      alert(`Game over, you ${props.isPlayersTurn ? 'lost' : 'won'}`);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!props.isPlayersTurn && isComputing) {
      executeMove();
    }
  }, [isComputing]);

  useEffect(() => {
    if (!props.isPlayersTurn && !isComputing) {
      setIsComputing(true);
    }
  }, [props.isPlayersTurn]);

  // handles the case where the player has a jump opportunity
  useEffect(() => {
    if (!isObjectEmpty(jumpFrom) && !isComputing) {
      setIsComputing(true);
    }
  }, [props.board]);

  return (
    <div className={classes.bot}>
      <p
        className={`${classes['bot__icon']} ${
          !props.isPlayersTurn ? classes['bot__icon--computing'] : ''
        }`}>
        🤖
        <span className={classes['bot__text']}>
          {calculationTime ? `${calculationTime}s` : ''}
        </span>
      </p>
    </div>
  );
};

export default Bot;
