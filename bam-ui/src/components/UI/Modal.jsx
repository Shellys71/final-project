import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElemnt = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {portalElemnt ? (
        <div>
          {ReactDOM.createPortal(
            <Backdrop onClose={props.onClose} />,
            portalElemnt
          )}
          {ReactDOM.createPortal(
            <ModalOverlay>{props.children}</ModalOverlay>,
            portalElemnt
          )}
        </div>
      ) : <p className={classes.error}>אופס, קרתה שגיאה! חזרו על הפעולה מאוחר יותר...</p>}
    </Fragment>
  );
};

export default Modal;
