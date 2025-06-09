import { useEffect, useState, useContext, Fragment, useCallback } from "react";

import classes from "./RequestsList.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const RequestsList = () => {
  const [pendingRequestList, setPendingRequestList] = useState([]);
  const [closedRequestList, setClosedRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const { user } = authCtx;

  const PENDING_REQUEST = "pending";
  const APPROVED_REQUEST = "approved";

  const setRequestListHandler = useCallback((requestsArray) => {
    let filteredRequests;
    if (!user.isAdmin) {
      filteredRequests = requestsArray.filter((request) => {
        return request.owner === user._id;
      });
    } else {
      filteredRequests = requestsArray;
    }
    setPendingRequestList(
      filteredRequests.filter((request) => {
        return request.status.state === PENDING_REQUEST;
      })
    );
    setClosedRequestList(
      filteredRequests.filter((request) => {
        return request.status.state !== PENDING_REQUEST;
      })
    );
  }, [user._id, user.isAdmin]);

  useEffect(() => {
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
        headers: { Authorization: authCtx.token },
      },
      setRequestListHandler
    );
  }, [authCtx.token, sendUserRequest, setRequestListHandler]);

  return (
    <section className={classes.section}>
      {isLoading ? (
        <h2 className={classes.title}>טוען...</h2>
      ) : (
        <Fragment>
          <h2 className={classes.title}>בקשות פתוחות</h2>
          <div className={classes.container}>
            {pendingRequestList.map((request, index) => (
              <div className={classes.request} key={index}>
                {request.description}
                <br />
                <p>{request.explanation}</p>
              </div>
            ))}
          </div>
          <h2 className={classes.title}>בקשות סגורות</h2>
          <div className={classes.container}>
            {closedRequestList.map((request, index) => (
              <div className={classes.request} key={index}>
                {request.status.state === APPROVED_REQUEST ? (
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
                <p>{request.explanation}</p>
              </div>
            ))}
          </div>
          {error && <p>{error}</p>}
        </Fragment>
      )}
    </section>
  );
};

export default RequestsList;
