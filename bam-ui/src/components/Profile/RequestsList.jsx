import React, { useEffect, useState, useContext } from "react";

import classes from "./RequestsList.module.css";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";

const RequestsList = () => {
  const [requestList, setRequestList] = useState([]);

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    sendUserRequest(
      {
        url: "http://localhost:5000/requests",
        headers: { Authorization: `${authCtx.token}` },
      },
      (data) => {
        setRequestList(data);
      }
    );
  }, []);

  return (
    <section className={classes.request}>
      {requestList.map((request, index) => (
        <div key={index}>{request.description}</div>
      ))}
    </section>
  );
};

export default RequestsList;
