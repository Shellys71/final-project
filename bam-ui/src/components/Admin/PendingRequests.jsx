import React, { useEffect, useState, useContext, Fragment } from "react";

import classes from "./PendingRequests.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import PendingRequestItem from "./PendingRequestItem";

const RequestsList = () => {
  const PENDING_REQUEST = "pending";

  const [pendingRequestList, setPendingRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const setPendingRequestsHandler = (requestsList) => {
    const pendingRequests = requestsList.filter((request) => {
      return request.status.state === PENDING_REQUEST;
    });
    setPendingRequestList(pendingRequests);
  };

  useEffect(() => {
    console.log("hererererere");
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
        headers: { Authorization: authCtx.token },
      },
      setPendingRequestsHandler
    );
  }, [sendUserRequest, authCtx.token]);

  const approveRequestState = (requestId) => {
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
            state: "approved",
          },
        },
      },
      () => {}
    );
  };

  const rejectRequestState = (requestId) => {
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
            state: "rejected",
            details: "לא ראוי בשיט",
          },
        },
      },
      () => {}
    );
  };

  return (
    <section className={classes.section}>
      <h1>בקשות פתוחות</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Fragment>
          {error && <p>{error}</p>}
          <div className={classes.container}>
            {pendingRequestList.map((request) => (
              <PendingRequestItem
                key={request._id}
                ownerName={request.owner.name}
                description={request.description}
                explanation={request.explanation}
                createdAt={request.createdAt.slice(0, 10)}
                onApprove={approveRequestState.bind(null, request._id)}
                onReject={rejectRequestState.bind(null, request._id)}
              />
            ))}
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default RequestsList;
