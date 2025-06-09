import React, { useEffect, useState, useContext, Fragment } from "react";

import classes from "./PendingRequests.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const RequestsList = () => {
  const [pendingRequestList, setPendingRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const PENDING_REQUEST = "pending";
  
  const setPendingRequestsHandler = (requestsList) => {
    const pendingRequests = requestsList.filter((request) => { 
      return request.status.state === PENDING_REQUEST;
    });
    setPendingRequestList(pendingRequests);
  };

  useEffect(() => {
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
        headers: { Authorization: authCtx.token },
      },
      setPendingRequestsHandler
    );
  }, [sendUserRequest, authCtx.token]);

  const changeRequestState = (requestId, state) => {
    sendUserRequest(
      {
        url: `http://localhost:5000/requests/${requestId}`,
        method: "PATCH",
        headers: {
          Authorization: authCtx.token,
          "Content-Type": "application/json",
        },
        body: {
          status: {
            state,
          },
        },
      },
      () => {}
    );
  };

  return (
    <section className={classes.section}>
      {isLoading ? (
        <h2 className={classes.title}>טוען...</h2>
      ) : (
        <Fragment>
          {error && <p>{error}</p>}
          <h1>בקשות פתוחות</h1>
          <div className={classes.container}>
            {pendingRequestList.map((request, index) => (
              <div className={classes.request} key={index}>
                <p>שולח הבקשה: {request.owner.name}</p>
                {request.description}
                <br />
                <p>פירוט: {request.explanation}</p>
                <p>תאריך: {request.createdAt.slice(0, 10)}</p>
                <button
                  className={classes.approve}
                  id="approve"
                  onClick={changeRequestState.bind(
                    null,
                    request._id,
                    "approved"
                  )}
                // onClick={(event) => {
                //     changeRequestState(event, request._id)
                // }}
                >
                  אשר
                </button>
                <button
                  className={classes.reject}
                  id="reject"
                  onClick={changeRequestState.bind(
                    null,
                    request._id,
                    "rejected"
                  )}
                >
                  סרב
                </button>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default RequestsList;
