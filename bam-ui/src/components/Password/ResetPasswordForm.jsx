import React, { useState, useRef, Fragment } from "react";

import classes from "./ForgotPasswordForm.module.css";
import useHttp from "../../hooks/use-http";
import ErrorPage from "../../pages/ErrorPage";

const isRightPassword = (value) => value.length >= 7;

const AuthForm = () => {
  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const [wrongInputMessage, setWrongInputMessage] = useState("");
  //   const [successMessage, setSuccessMessage] = useState("");

  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    // setSuccessMessage("");

    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    if (!isRightPassword(enteredPassword)) {
      setWrongInputMessage("סיסמא חייבת להכיל 7 מספרים לפחות");
      return;
    }
    if (!isRightPassword(enteredConfirmPassword)) {
      setWrongInputMessage("סיסמא חייבת להכיל 7 מספרים לפחות");
      return;
    }
    if (enteredPassword !== enteredConfirmPassword) {
      setWrongInputMessage("הסיסמאות חייבות להיות זהות");
      return;
    }

    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/users/reset-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email: enteredPassword },
      },
      (data) => {
        alert(data.status);
      }
    );
  };

  const pageContent = (
    <Fragment>
      <form onSubmit={submitHandler}>
        <h1>אימייל</h1>
        <div className={classes.control}>
          <label htmlFor="password">סיסמא</label>
          <input
            type="password"
            id="password"
            minLength={7}
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="confirm-password">אשר סיסמא</label>
          <input
            type="password"
            id="confirm-password"
            minLength={7}
            required
            ref={passwordInputRef}
          />
        </div>
        {wrongInputMessage !== "" && (
          <div className={classes.error}>{wrongInputMessage}</div>
        )}
        <div className={classes.actions}>
          {!isLoading && <button>החלף סיסמא</button>}
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
