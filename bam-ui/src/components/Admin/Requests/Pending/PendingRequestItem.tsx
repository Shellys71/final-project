import React from "react";

import classes from "./PendingRequestItem.module.css";

type Props = {
  ownerName: string;
  description: string;
  explanation: string;
  createdAt: string;
  onApprove: () => void;
  onReject: () => void;
};

const PendingRequestItem: React.FC<Props> = (props) => {
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
