import { useEffect, useState, useContext, Fragment } from "react";

import classes from "./RequestsHistory.module.css";
import AuthContext from "../../../../store/auth-context";
import useHttp from "../../../../hooks/use-http";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import DatesRangeForm from "./DatesRangeForm";
import LoadMoreRequests from "./LoadMoreRequests";
import ErrorPage from "../../../../pages/ErrorPage";
import { RANGE } from "../../../../utils/request";

const RequestsHistory = () => {
  const [requestList, setRequestList] = useState([]);
  const [requestsLimit, setRequestsLimit] = useState(RANGE);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests?limit=${requestsLimit}`,
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        setRequestList(data);
      }
    );
  }, [authCtx.token, sendUserRequest, requestsLimit]);

  const changeLimitHandler = (newLimit) => {
    setRequestsLimit(newLimit);
  };

  const pageContent = (
    <Fragment>
      <h1>היסטוריית בקשות</h1>
      <DatesRangeForm
        onSubmitDatesRange={(data) => {
          setRequestList(data);
        }}
        requestsLimit={requestsLimit}
      />
      <div className={classes.container}>
        {requestList.length !== 0 ? (
          requestList.map((request) => (
            <div className={classes.request} key={request._id}>
              {request.description}
              <br />
              <p>{request.explanation}</p>
              <p>{request.createdAt.slice(0, 10)}</p>
            </div>
          ))
        ) : (
          <p>אין בקשות כרגע</p>
        )}
      </div>
      {requestList.length !== 0 && (
        <LoadMoreRequests
          currentLimit={requestsLimit}
          onChangeLimit={changeLimitHandler}
        />
      )}
    </Fragment>
  );

  return (
    <section className={classes.section}>
      {error && <ErrorPage error={error} />}
      {isLoading && <LoadingSpinner />}
      {!error && !isLoading && pageContent}
    </section>
  );
};

export default RequestsHistory;
