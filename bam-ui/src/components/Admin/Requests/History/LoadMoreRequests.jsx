import React, { useState, Fragment } from "react";

import classes from "./LoadMoreRequests.module.css";

const SkipRequests = (props) => {
  const RANGE = 5;

  const [currentLimit, setCurrentLimit] = useState(props.currentLimit);

  const skipHandler = () => {
    props.onChangeLimit(currentLimit + RANGE);
    setCurrentLimit(currentLimit + RANGE);
  };

  return (
    <Fragment>
      <div className={classes.content}>
        <button onClick={skipHandler}>הצג עוד</button>
      </div>
    </Fragment>
  );
};

export default SkipRequests;
