import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./RequestsForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const RequestsForm = () => {
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const descriptionInputRef = useRef();
  const explanationInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredDescription = descriptionInputRef.current.value;
    const enteredExplanation = explanationInputRef.current.value;

    // optional: Add validation
    const body = {
      description: enteredDescription,
      explanation: enteredExplanation,
      status: {
        state: "pending",
      },
    };
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
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
      }
    );
  };

  return (
    <section className={classes.content}>
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
          <textarea id="explanation" required ref={explanationInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>צור בקשה</button>}
          {isLoading && <p>הבקשה נשלחת...</p>}
          <button type="button" className={classes.toggle}></button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </section>
  );
};

export default RequestsForm;
