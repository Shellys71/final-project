import React, { Fragment } from "react";

import classes from "./Error.module.css";
import errorPigImage from "../../assets/errorImage.png";

const Error = (props) => {
  return (
    <Fragment>
      <p className={classes.text}>אופס! משהו השתבש...</p>
      <p className={classes.code}>שגיאה {props.error.code}</p>
      <img src={errorPigImage} alt="errorPig" />
    </Fragment>
  );
};

export default Error;
