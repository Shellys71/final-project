import React, { useState, Fragment } from "react";

import classes from "./LoadMoreRequests.module.css";
import { RANGE } from "../../../../utils/request";

const SkipRequests = (props) => {
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
