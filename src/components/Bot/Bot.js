import classes from './Bot.module.css';
import { applyBestMove, isGameOver } from '../../utils';
import { useEffect, useState } from 'react';

const Bot = (props) => {
  const [isComputing, setIsComputing] = useState(false);
  console.log('Bot.js', props.isPlayersTurn);

  if (props.isGameOver && isComputing) {
    setIsComputing(false);
  }
  if (!props.isPlayersTurn && !isComputing) {
    setIsComputing(true);
    const move = applyBestMove(props.board, props.isPlayersTurn);
    if (move) {
      const timer = setTimeout(() => {
        clearInterval(timer);
        setIsComputing(false);
        props.updateBoard(move);
      }, 1000);
    } else {
      alert(`Game over, you ${props.isPlayersTurn ? 'lost' : 'won'}`);
      window.location.reload();
    }
  }

  return (
    <div className={classes.bot}>
      <p className={`${classes['bot__icon']} ${isComputing ? classes['bot__icon--computing'] : '' }`}>
        🤖
        <span className={classes['bot__text']}></span>
      </p>
    </div>
  )
}; 

export default Bot; 
