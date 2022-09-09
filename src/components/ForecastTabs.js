import {React,useState} from "react";
import cloudyWhite from "../images/cloudy-white.svg";
import cloudyPurpleActive from "../images/cloudy-purple-active.svg";

import styles from "./ForecastTabs.module.css";
// import styles from "./CityForm.module.css";



const ForecastTabs = (props) => {
  const [active,setActive] = useState(0);  
  const forecastClickHandler = (active) => {
    setActive(active);
    props.onTabChange(active);
  }
  return (
    <div className={styles["forecast-tabs"]}>
      {props.forecast.days.slice(0, 4).map((day, i) => (
        <div
          key={i}
          className={`${styles["day-tab"]} ${i === active ? styles["active"] : ""}`}
          onClick={() => forecastClickHandler(i)}
        >
          <div className="day">{day.day}</div>
          <div className="text-forecast">
            <img
              src={i === active ? cloudyPurpleActive : cloudyWhite}
              alt="Cloudy"
            />
          </div>
          {/* First Humidity for now */}
          <div className="humidity">Humidity: {day.forecast[0].humidity}%</div>
        </div>
      ))}
    </div>
  );
};

export default ForecastTabs;
