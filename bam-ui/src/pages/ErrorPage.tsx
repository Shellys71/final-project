import React from "react";

import Error from "../components/UI/Error";
import ErrorModel from "../models/error";

const ErrorPage: React.FC<{
  error: ErrorModel;
}> = (props) => {
  return <Error error={props.error} />;
};

export default ErrorPage;
