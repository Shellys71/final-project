import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const AuthForm = () => {
  const navigate = useNavigate();

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const nameInputRef = useRef();
  const idfNumberInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const { login } = authCtx;

  const [isLogin, setIsLogin] = useState(true);

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
    }

    // optional: Add validation
    let url;
    let body;
    if (isLogin) {
      url = "http://localhost:5000/users/login";
      body = {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      };
    } else {
      url = "http://localhost:5000/users";
      body = {
        name: enteredName,
        idfNumber: enteredIdfNumber,
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
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

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "התחברות" : "הרשמות"}</h1>
      <form onSubmit={submitHandler}>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="name">שם מלא</label>
            <input type="name" id="name" required ref={nameInputRef} />
          </div>
        )}
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="idfNumber">מספר אישי</label>
            <input
              type="idfNumber"
              id="idfNumber"
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
            required
            ref={passwordInputRef}
          />
        </div>
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
        {error && <p>{error}</p>}
      </form>
    </section>
  );
};

export default AuthForm;
