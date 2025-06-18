import React, { useState, useRef, useContext, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import ErrorPage from "../../pages/ErrorPage";

const isName = (value) => !/\d/.test(value);
const isEmail = (value) => value.includes("@");
const isRightPassword = (value) => value.length >= 7;
const isRightIdfNumber = (value) => value.length === 7 && /^\d+$/.test(value);

const AuthForm = () => {
  const navigate = useNavigate();

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const [wrongInputMessage, setWrongInputMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const nameInputRef = useRef();
  const idfNumberInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const { login } = authCtx;

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let enteredName;
    let enteredIdfNumber;
    if (!isLogin) {
      enteredName = nameInputRef.current.value;
      enteredIdfNumber = idfNumberInputRef.current.value;
      if (!isName(enteredName)) {
        setWrongInputMessage("שם לא יכול להכיל מספרים");
        return;
      }
      if (!isRightIdfNumber(enteredIdfNumber)) {
        setWrongInputMessage("מספר אישי חייב להכיל 7 מספרים בלבד");
        return;
      }
    }

    if (!isEmail(enteredEmail)) {
      setWrongInputMessage("אימייל חייב להכיל @");
      return;
    }
    if (!isRightPassword(enteredPassword)) {
      setWrongInputMessage("סיסמא חייבת להכיל 7 מספרים לפחות");
      return;
    }

    let url;
    let body;
    if (isLogin) {
      url = `${process.env.REACT_APP_HOST}/users/login`;
      body = {
        email: enteredEmail,
        password: enteredPassword,
      };
    } else {
      url = `${process.env.REACT_APP_HOST}/users`;
      body = {
        name: enteredName,
        idfNumber: enteredIdfNumber,
        email: enteredEmail,
        password: enteredPassword,
      };
    }
    sendUserRequest(
      {
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      },
      (data) => {
        login(data.token, data.user);
        navigate("/");
      }
    );
  };

  const pageContent = (
    <Fragment>
      <h1>{isLogin ? "התחברות" : "הרשמה"}</h1>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="name">שם מלא</label>
            <input type="text" id="name" required ref={nameInputRef} />
          </div>
        )}
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="idfNumber">מספר אישי</label>
            <input
              type="number"
              id="idfNumber"
              maxLength={7}
              required
              ref={idfNumberInputRef}
            />
          </div>
        )}
        <div className={classes.control}>
          <label htmlFor="email">אימייל</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
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
        {isLogin && <p className={classes.forgotPasswordLink}><Link to="/forgot-password">שכחתי סיסמא</Link></p>}
        {wrongInputMessage !== "" && (
          <div className={classes.error}>{wrongInputMessage}</div>
        )}
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "התחבר" : "צור חשבון"}</button>}
          {isLoading && <p>הבקשה נשלחת...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "צור חשבון חדש" : "התחבר עם חשבון קיים"}
          </button>
        </div>
      </form>
    </Fragment>
  );

  return (
    <section className={classes.auth}>
      {error && <ErrorPage error={error} />}
      {!error && pageContent}
    </section>
  );
};

export default AuthForm;
