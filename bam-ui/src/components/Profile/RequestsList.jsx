import React, { useEffect, useState, useContext, Fragment } from "react";

import classes from "./RequestsList.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const RequestsList = () => {
  const [requestList, setRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  const { user } = authCtx;

  const PENDING_REQUEST = "pending";
  const APPROVED_REQUEST = "approved";

  const setRequestListHandler = (requestsArray) => {
    let filteredRequests;
    if (!user.isAdmin) {
      filteredRequests = requestsArray.filter((request) => {
        return request.owner === user._id;
      });
    } else {
      filteredRequests = requestsArray;
    }
    setRequestList(filteredRequests);
  };

  useEffect(() => {
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        setRequestListHandler(data);
      }
    );
  }, []);

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>בקשות פתוחות</h2>
      <div className={classes.container}>
        {requestList.map(
          (request, index) =>
            request.status.state === PENDING_REQUEST && (
              <div className={classes.request} key={index}>
                {request.description}
                <br />
                <p>{request.explanation}</p>
              </div>
            )
        )}
      </div>
      <h2 className={classes.title}>בקשות סגורות</h2>
      <div className={classes.container}>
        {requestList.map(
          (request, index) =>
            request.status.state !== PENDING_REQUEST && (
              <div className={classes.request} key={index}>
                {request.status.state === APPROVED_REQUEST ? (
                  <p className={classes.approved}>מאושרת</p>
                ) : (
                  <p className={classes.rejected}>
                    {request.status.details? `נדחתה: ${request.status.details}` : "נדחתה"}
                  </p>
                )}
                {request.description}
                <br />
                <p>{request.explanation}</p>
              </div>
            )
        )}
      </div>
    </section>
  );
};

export default RequestsList;
