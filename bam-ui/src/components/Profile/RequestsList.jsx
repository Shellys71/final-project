import { useEffect, useState, useContext, Fragment, useCallback } from "react";

import classes from "./RequestsList.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import { State } from "../../utils/request"; 

const RequestsList = () => {
  const [pendingRequestList, setPendingRequestList] = useState([]);
  const [closedRequestList, setClosedRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const { user } = authCtx;

  const setRequestListHandler = useCallback(
    (requestsArray) => {
      let filteredRequests;
      if (!user.isAdmin) {
        filteredRequests = requestsArray.filter((request) => {
          return request.owner._id === user._id;
        });
      } else {
        filteredRequests = requestsArray;
      }
      setPendingRequestList(
        filteredRequests.filter((request) => {
          return request.status.state === State.PENDING;
        })
      );
      setClosedRequestList(
        filteredRequests.filter((request) => {
          return request.status.state !== State.PENDING;
        })
      );
    },
    [user._id, user.isAdmin]
  );

  useEffect(() => {
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests`,
        headers: { Authorization: authCtx.token },
      },
      setRequestListHandler
    );
  }, [authCtx.token, sendUserRequest, setRequestListHandler]);

  const pageContent = (
    <Fragment>
      {error && <p className={classes.error}>{error}</p>}
      <h2 className={classes.title}>בקשות פתוחות</h2>
      <div className={classes.container}>
        {pendingRequestList.length !== 0 ? (
          pendingRequestList.map((request) => (
            <div className={classes.request} key={request._id}>
              {request.description}
              <br />
              <p>{request.explanation}</p>
            </div>
          ))
        ) : (
          <p>אין בקשות פתוחות כרגע</p>
        )}
      </div>
      <h2 className={classes.title}>בקשות סגורות</h2>
      <div className={classes.container}>
        {closedRequestList.length !== 0 ? (
          closedRequestList.map((request) => (
            <div className={classes.request} key={request._id}>
              {request.status.state === State.APPROVED ? (
                <p className={classes.approved}>אושרה</p>
              ) : (
                <p className={classes.rejected}>
                  {request.status.details
                    ? `נדחתה: ${request.status.details}`
                    : "נדחתה"}
                </p>
              )}
              {request.description}
              <br />
              <p className={classes.text}>{request.explanation}</p>
            </div>
          ))
        ) : (
          <p className={classes.text}>אין בקשות סגורות כרגע</p>
        )}
      </div>
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

export default RequestsList;
