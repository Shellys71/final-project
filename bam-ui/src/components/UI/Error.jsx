import React, { Fragment } from "react";

import classes from "./Error.module.css";
import errorPigImage from "../../assets/errorImage.png";

const Error = (props) => {
  return (
    <Fragment>
      <p>אופס! משהו השתבש...</p>
      <p className={classes.code}>שגיאה {props.error.code}</p>
      <img src={errorPigImage} alt="error pig image" />
    </Fragment>
  );
};

export default Error;
