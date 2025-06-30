import React, { useState, useRef, Fragment } from "react";

import classes from "./ForgotPasswordForm.module.css";
import useHttp from "../../hooks/use-http";
import ErrorPage from "../../pages/ErrorPage";

const isEmail = (value: string) => value.includes("@");

const ForgotPasswordForm: React.FC = () => {
  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const [wrongInputMessage, setWrongInputMessage] = useState("");
  const [message, setMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");

    const enteredEmail = emailInputRef.current!.value;

    if (!isEmail(enteredEmail)) {
      setWrongInputMessage("אימייל חייב להכיל @");
      return;
    }

    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/users/forgot-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email: enteredEmail },
      },
      (data) => {
        setMessage(data.message);
      }
    );
  };

  const pageContent = (
    <Fragment>
      <h1>שחזור סיסמא</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">אימייל</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        {wrongInputMessage !== "" && (
          <div className={classes.error}>{wrongInputMessage}</div>
        )}
        <div className={classes.actions}>
          {!isLoading && message === "" && <button>שלח לי אימייל</button>}
          {isLoading && <p>הבקשה נשלחת...</p>}
          {message !== "" && <p>{message}</p>}
        </div>
      </form>
    </Fragment>
  );

  return (
    <Fragment>
      {error ? (
        <ErrorPage error={error} />
      ) : (
        <section className={classes.forgotPassword}>{pageContent}</section>
      )}
    </Fragment>
  );
};

export default ForgotPasswordForm;
