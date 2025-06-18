import React, { Fragment, useState, useContext, useEffect } from "react";

import LoadingSpinner from "../../../UI/LoadingSpinner";
import classes from "./DatesRangeForm.module.css";
import AuthContext from "../../../../store/auth-context";
import useHttp from "../../../../hooks/use-http";
import ErrorPage from "../../../../pages/ErrorPage";

const DatesRangeForm = (props) => {
  const [fromDate, setFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (untilDate !== "" && fromDate !== "") {
      submitRangeHandler(fromDate, untilDate);
    }
  }, [fromDate, untilDate]);

  const submitRangeHandler = (currentFromDate, currentUntilDate) => {
    let url;
    const requestsLimit = props.requestsLimit;
    if (requestsLimit) {
      url = `${process.env.REACT_APP_HOST}/requests?limit=${requestsLimit}&from=${currentFromDate}&until=${currentUntilDate}`;
    } else {
      url = `${process.env.REACT_APP_HOST}/requests?limit=5&from=${currentFromDate}&until=${currentUntilDate}`;
    }
    sendUserRequest(
      {
        url,
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        props.onSubmitDatesRange(data);
      }
    );
  };

  const pageContent = (
    <form className={classes.form}>
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
    </form>
  );

  return (
    <Fragment>
      {error && <p className={classes.error}>משהו השתבש בבחירת התאריכים! נסה שוב מאוחר יותר...</p>}
      {isLoading && <LoadingSpinner />}
      {!error && !isLoading && pageContent}
    </Fragment>
  );
};

export default DatesRangeForm;
