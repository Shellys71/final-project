import React, { Fragment, useState, useContext } from "react";

import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./DatesRangeForm.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const DatesRangeForm = (props) => {
  const [fromDate, setFromDate] = useState("");
  const [untilDate, setUntilDate] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const submitRangeHandler = (event) => {
    event.preventDefault();
    sendUserRequest(
      {
        url: `http://localhost:5000/requests?from=${fromDate}&until=${untilDate}`,
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        props.onSubmitDatesRange(data);
      }
    );
  };

  return (
    <Fragment>
      {error && <p>הבקשה נכשלה...</p>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <form
          className={classes.form}
          onSubmit={submitRangeHandler}
        >
          <label htmlFor="from">מהתאריך: </label>
          <input
            type="date"
            id="from"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
            }}
          />
          <label htmlFor="until">עד התאריך: </label>
          <input
            type="date"
            id="until"
            value={untilDate}
            onChange={(event) => {
              setUntilDate(event.target.value);
            }}
          />
          <button type="submit">סנן</button>
        </form>
      )}
    </Fragment>
  );
};

export default DatesRangeForm;
