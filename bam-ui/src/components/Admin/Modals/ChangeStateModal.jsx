import React, { useEffect, useState } from "react";

import Modal from "../../UI/Modal";
import classes from "./ChangeStateModal.module.css";

const ChangeStateModal = (props) => {
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  useEffect(() => {
    if (props.selectedState === "approve") {
      setApproveModal(true);
    } else {
      setRejectModal(true);
    }
  }, [props.selectedState]);

  const approveModalContent = (
    <div className={classes.content}>
      <p>האם אתה בטוח שאתה רוצה לאשר את הבקשה של {props.ownerName}?</p>
      <div>
        <button onClick={props.approveRequest} className={classes.approve}>
          כן
        </button>
        <button onClick={props.onClose} className={classes.reject}>
          לא
        </button>
      </div>
    </div>
  );

  const rejectModalContent = (
    <div className={classes.content}>
      <p>האם אתה בטוח שאתה רוצה לסרב את הבקשה של {props.ownerName}?</p>
      <div>
        <label htmlFor="details">סיבת הסירוב:</label>
        <textarea id="details" placeholder="אין חובה למלא שדה זה" ref={props.detailsInputRef}></textarea>
      </div>
      <div>
        <button onClick={props.rejectRequest} className={classes.approve}>
          כן
        </button>
        <button onClick={props.onClose} className={classes.reject}>
          לא
        </button>
      </div>
    </div>
  );

  return (
    <Modal onClose={props.onClose}>
      {approveModal && approveModalContent}
      {rejectModal && rejectModalContent}
    </Modal>
  );
};

export default ChangeStateModal;
