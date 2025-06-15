import React, { useState, useContext, Fragment } from "react";

import classes from "./LoadMoreRequests.module.css";
import useHttp from "../../hooks/use-http";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";

const SkipRequests = (props) => {
  const RANGE = 5;

  const [currentLimit, setCurrentLimit] = useState(RANGE);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const skipHandler = () => {
    sendUserRequest(
      {
        url: `http://localhost:5000/requests?limit=${currentLimit + RANGE}`,
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        props.onSkippedRequests(data);
      }
    );
    setCurrentLimit(currentLimit + RANGE);
  };

  return (
    <Fragment>
      {error && <p>הבקשה נכשלה...</p>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.content}>
          <button onClick={skipHandler}>הצג עוד</button>
        </div>
      )}
    </Fragment>
  );
};

export default SkipRequests;
