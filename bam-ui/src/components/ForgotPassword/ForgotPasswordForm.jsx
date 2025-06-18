import React, { useState, useRef, Fragment } from "react";

import classes from "./ForgotPasswordForm.module.css";
import useHttp from "../../hooks/use-http";
import ErrorPage from "../../pages/ErrorPage";

const isEmail = (value) => value.includes("@");

const AuthForm = () => {
  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const [wrongInputMessage, setWrongInputMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

  const emailInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    // setSuccessMessage("");

    const enteredEmail = emailInputRef.current.value;

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
        alert(data.status);
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
          {!isLoading && <button>שלח לי אימייל</button>}
          {isLoading && <p>הבקשה נשלחת...</p>}
          {/* {successMessage !== "" && <p>{successMessage}</p>} */}
        </div>
      </form>
    </Fragment>
  );

  return (
    <section className={classes.forgotPassword}>
      {error && <ErrorPage error={error} />}
      {!error && pageContent}
    </section>
  );
};

export default AuthForm;
