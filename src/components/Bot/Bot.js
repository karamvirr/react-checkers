import classes from './Bot.module.css';
import { jumpOpportunityExists, isObjectEmpty } from '../../utils';
import { calculateBestMove } from '../../utils/bot';
import { useEffect, useState } from 'react';

const Bot = props => {
  const [isComputing, setIsComputing] = useState(false);
  const [jumpFrom, setJumpFrom] = useState({});

  const executeMove = () => {
    const move = calculateBestMove(props.board, props.isPlayer, jumpFrom);
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
      }, 750);
    } else {
      alert(`Game over, you ${props.isPlayersTurn ? 'lost' : 'won'}`);
      window.location.reload();
    }
  };

  const isBotsTurn = () => {
    return props.isPlayer === props.isPlayersTurn;
  };

  useEffect(() => {
    if (isBotsTurn() && isComputing) {
      executeMove();
    }
  }, [isComputing]);

  useEffect(() => {
    if (!isBotsTurn()) {
      setIsComputing(false);
    } else if (!isComputing) {
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
          isBotsTurn() && classes['bot__icon--computing']
        }`}>
        🤖
      </p>
    </div>
  );
};

export default Bot;
