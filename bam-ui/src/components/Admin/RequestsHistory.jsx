import { useEffect, useState, useContext, Fragment } from "react";

import classes from "./RequestsHistory.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import DatesRangeForm from "./DatesRangeForm";

const RequestsHistory = () => {
  const [requestList, setRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    sendUserRequest(
      {
        url: "http://localhost:5000/requests?limit=5",
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        setRequestList(data);
      }
    );
  }, [authCtx.token, sendUserRequest]);

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
        </Fragment>
      )}
    </section>
  );
};

export default RequestsHistory;
