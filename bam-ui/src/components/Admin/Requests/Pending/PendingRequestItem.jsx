import React from "react";

import classes from "./PendingRequestItem.module.css";

const PendingRequestItem = (props) => {
  return (
    <div className={classes.request}>
      <p>שולח הבקשה: {props.ownerName}</p>
      {props.description}
      <br />
      <p>פירוט: {props.explanation}</p>
      <p>תאריך: {props.createdAt}</p>
      <div className={classes.stateButtons}>
        <button className={classes.approve} onClick={props.onApprove}>
          אשר
        </button>
        <button className={classes.reject} onClick={props.onReject}>
          סרב
        </button>
      </div>
    </div>
  );
};

export default PendingRequestItem;
