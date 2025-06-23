import React, { Fragment } from "react";

import classes from "./Error.module.css";
import errorPigImage from "../../assets/errorImage.png";

const Error = (props) => {
  return (
    <div className={classes.container}>
      <p className={classes.text}>אופס! משהו השתבש...</p>
      <p className={classes.code}>שגיאה {props.error.code} - {props.error.info}</p>
      <img src={errorPigImage} alt="errorPig" />
    </div>
  );
};

export default Error;
