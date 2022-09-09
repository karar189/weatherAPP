import React, { useState, useEffect, useCallback } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import CityForm from "./components/CityForm";
import ForecastGraph from "./components/ForecastGraph";
import ForecastTabs from "./components/ForecastTabs";

import cloudyLarge from "./images/cloudy-large.svg";
import keys from "./secrets.json";
import "./App.css";

function App() {
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Atlanta, USA");
  const [chart, setChart] = useState({
    chartLabels: ["Now"],
    chartData: [],
    chartMin: "",
    chartMax: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const activeDay = 1;

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const tabChangeHandler = (active) => {
    // update data for chart
    updateChart(active);
  };
  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  const fetchForecastHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keys.key}&units=metric`
      ).then((response) => response.json());
      const forecastData = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${keys.key}&units=metric`
      ).then((response) => response.json());

      const c = new Date();
      //5:05 PM, Mon, Nov 23, 2020
      const currentTime = c.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
      const timeUpdated = new Date();

      let time = [];
      let temp = [];
      let currentDate = timeUpdated.toLocaleString("en-US", {
        day: "numeric",
      });
      let nextDate = addDays(timeUpdated, 1);
      let prevDate;
      nextDate = nextDate.toLocaleString("en-US", {
        day: "numeric",
      });
      let transformedDays = [];
      let tempData = [];
      let j = 0;
      // add in our current time and temp
      temp.push(Math.round(currentData.main.temp));
      time.push("Now");
      for (let i = 0; i < forecastData.list.length; i++) {
        const fData = forecastData.list[i];

        const t = new Date(parseInt(fData.dt * 1000));
        const humanDateFormat = t.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        });
        const hour = t.toLocaleString("en-US", {
          hour: "numeric",
        });
        currentDate = t.toLocaleString("en-US", {
          day: "numeric",
        });
        if (timeUpdated < t && j <= 6) {
          // get only 7 items
          time.push(hour);
          temp.push(Math.round(fData.main.temp));
          j++;
        }

        if (currentDate === nextDate) {
          transformedDays.push({ day: prevDate, forecast: tempData });
          nextDate = addDays(t, 1);
          nextDate = nextDate.toLocaleString("en-US", {
            day: "numeric",
          });
          tempData = [];
        }
        // add new day entry
        tempData.push({
          time: humanDateFormat,
          hour: hour,
          temp: Math.round(fData.main.temp),
          feels_like: Math.round(fData.main.feels_like),
          pressure: Math.round(fData.main.pressure),
          humidity: fData.main.humidity,
        });
        prevDate = humanDateFormat;
      }

      const transformedForecast = [
        {
          name: currentData.name,
          currentTime: currentTime,
          feels_like: Math.round(currentData.main.feels_like),
          temp: Math.round(currentData.main.temp),
          humidity: Math.round(currentData.main.humidity),
          wind: Math.round(currentData.wind.speed),
          days: transformedDays,
          current: {
            chartLabels: time,
            chartData: temp,
            chartMin: Math.min(...temp),
            chartMax: Math.max(...temp),
          },
        },
      ];
      setChart({
        chartLabels: time,
        chartData: temp,
        chartMin: Math.min(...temp),
        chartMax: Math.max(...temp),
      });

      setForecast(transformedForecast);

      if (!currentData.ok || !forecastData.ok) {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [city]);
  useEffect(() => {
    fetchForecastHandler();
  }, [fetchForecastHandler]);

  const addCityHandler = (city) => {
    setCity(city);
  };

  const updateChart = (active) => {
    if (active !== 0) {
      const activeForecast = forecast[0].days[active].forecast;
      let temp = activeForecast.map((day) => {
        return day.temp;
      });
      let hour = activeForecast.map((day) => {
        return day.hour;
      });
      setChart({
        chartLabels: hour,
        chartData: temp,
        chartMin: Math.min(temp),
        chartMax: Math.max(temp),
      });
    } else {
      setChart(forecast[0].current);
    }
  };

  let content = <p>No forecast available.</p>;

  if (error) {
    content = <p>Error: {error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  if (forecast.length > 0) {
    content = (
      <section className="main-inner">
        <div className="left-widget">
          <div className="cityTitle">{forecast[0].name} Weather</div>
          <div className="currentTime">{forecast[0].currentTime}</div>
          <div className="currentForecast">
            <img src={cloudyLarge} alt="Cloudy" />
            <div className="temp-wrapper">
              <span className="temp-big">
                {/* this should be the top level temp  */}
                {forecast[0].temp}
              </span>
              <div className="sup">
                <span className="deg">&deg;</span> C
              </div>
            </div>
          </div>
          <div className="textForecast">Cloudy</div>
          <div className="feelsLike">
            Feels Like {forecast[0].feels_like}&deg;
          </div>
          <div className="row bottom-info">
            <div className="col">
              <h4>Humidity</h4>
              {forecast[0].humidity}%
            </div>
            <div className="col">
              <h4>Wind Speed</h4>
              {forecast[0].wind} mph
            </div>
          </div>
        </div>
        <div className="right-widget">
          <div className="right-widget-inner">
            <div className="chart-container">
              <ForecastGraph
                chartLabels={chart.chartLabels}
                chartData={chart.chartData}
                chartMin={chart.chartMin}
                chartMax={chart.chartMax}
              />
            </div>
            <ForecastTabs
              forecast={forecast[0]}
              onTabChange={tabChangeHandler}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="App">
      <section className="main">
        <CityForm onSubmitHandler={addCityHandler} />
        {content}
      </section>
    </div>
  );
}

export default App;
