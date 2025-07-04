import React, { useRef, useContext, Fragment, useState } from "react";

import classes from "./RequestsForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import ErrorPage from "../../pages/ErrorPage";
import { State } from "../../utils/request";

const RequestsForm = () => {
  const authCtx = useContext(AuthContext);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const [successMessage, setSuccessMessage] = useState("");

  const descriptionInputRef = useRef();
  const explanationInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    setSuccessMessage("");
    const enteredDescription = descriptionInputRef.current.value;
    const enteredExplanation = explanationInputRef.current.value;

    const body = {
      description: enteredDescription,
      explanation: enteredExplanation,
      status: {
        state: State.PENDING,
      },
    };
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests`,
        method: "POST",
        headers: {
          Authorization: authCtx.token,
          "Content-Type": "application/json",
        },
        body,
      },
      () => {
        descriptionInputRef.current.value = "";
        explanationInputRef.current.value = "";
        setSuccessMessage("הבקשה נוצרה בהצלחה!");
      }
    );
  };

  const pageContent = (
    <Fragment>
      <h1>בקשה חדשה</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="description">סוג הבקשה</label>
          <select id="description" required ref={descriptionInputRef}>
            <option value=""> </option>
            <option value="בקשת השחרה">בקשת השחרה</option>
            <option value='בקשת אישור כניסה רגלי/רכוב לבה"ד'>
              בקשת אישור כניסה רגלי/רכוב לבה"ד
            </option>
            <option value="בקשת קידוד חוגר">בקשת קידוד חוגר</option>
            <option value='בקשת טופס חתימה על שו"ס'>
              בקשת טופס חתימה על שו"ס
            </option>
          </select>
        </div>
        <div className={classes.control}>
          <label htmlFor="explanation">פירוט</label>
          <textarea
            id="explanation"
            maxLength={45}
            required
            ref={explanationInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>צור בקשה</button>}
          {isLoading && <p>הבקשה נשלחת...</p>}
          {successMessage !== "" && <p>{successMessage}</p>}
          <button type="button" className={classes.toggle}></button>
        </div>
      </form>
    </Fragment>
  );

  return (
    <Fragment>
      {error ? (
        <ErrorPage error={error} />
      ) : (
        <section className={classes.content}>{pageContent}</section>
      )}
    </Fragment>
  );
};

export default RequestsForm;
