import classes from './Square.module.css';

const Square = (props) => {
  let classList = classes['board__square'];
  if (props.alternatePattern) {
    classList += ` ${classes['board__square--alternating']}`;
  }
  if (props.isHighlighted) {
    classList += ` ${classes['board__square--highlighted']}`;
  }

  return (
    <div
      onClick={props.onClick}
      className={classList}>
      {props.children}
    </div>
  );
};

export default Square;
