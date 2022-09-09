import Section from '../UI/Section';
// import TaskItem from './TaskItem';
// import classes from './Tasks.module.css';

const Weather = (props) => {
  let weatherList = <h2>No forecasts found!</h2>;

  // if (props.items.length > 0) {
    // weatherList = (
      // <ul>
      //   {props.items.map((task) => (
      //     <TaskItem key={task.id}>{task.text}</TaskItem>
      //   ))}
      // </ul>
    // );
  // }

  let content = weatherList;

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  if (props.loading) {
    content = 'Loading weather...';
  }

  props.onSaveUserData(userData);

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default Weather;
