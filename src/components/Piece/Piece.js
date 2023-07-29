import classes from './Piece.module.css';

const Piece = (props) => {
  let classList = `${classes.piece}`;
  if (props.isPlayer) {
    classList += ` ${classes['piece--player']}`;
  } else {
    classList += ` ${classes['piece--opponent']}`;
  }

  if (props.isKing) {
    classList += ` ${classes['piece--king']}`;
  }

  return (
    <div onClick={() => { props.onClick(props.row, props.column, props.isPlayer) }} className={classList}></div>
  );
}; 

export default Piece; 
