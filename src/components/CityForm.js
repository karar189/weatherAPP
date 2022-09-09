import React, { useRef } from "react";
import styles from "./CityForm.module.css";

const CityForm = (props) => {
  const cityInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredCity = cityInputRef.current.value;
    props.onSubmitHandler(enteredCity);
  };

  return (
    <>
      <form className={styles["form-control"]} onSubmit={submitHandler}>
        <div>
          <label htmlFor="city">Enter your city</label>
          <input id="city" type="text" ref={cityInputRef} placeholder="Pune" />
        </div>
      </form>
    </>
  );
};

export default CityForm;
