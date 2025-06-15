import { useEffect, useState, useContext, Fragment } from "react";

import classes from "./RequestsHistory.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import DatesRangeForm from "./DatesRangeForm";
import LoadMoreRequests from "./LoadMoreRequests";

const RequestsHistory = () => {
  const RANGE = 5;

  const [requestList, setRequestList] = useState([]);
  const [requestsLimit, setRequestsLimit] = useState(RANGE);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    sendUserRequest(
      {
        url: `http://localhost:5000/requests?limit=${requestsLimit}`,
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

  return (
    <section className={classes.section}>
      <h1>היסטוריית בקשות</h1>
      {error && <p>{error}</p>}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          <DatesRangeForm
            onSubmitDatesRange={(data) => {
              setRequestList(data);
            }}
            requestsLimit={requestsLimit}
          />
          <div className={classes.container}>
            {requestList.map((request) => (
              <div className={classes.request} key={request._id}>
                {request.description}
                <br />
                <p>{request.explanation}</p>
              </div>
            ))}
          </div>
          <LoadMoreRequests
            currentLimit={requestsLimit}
            onChangeLimit={changeLimitHandler}
          />
        </Fragment>
      )}
    </section>
  );
};

export default RequestsHistory;
