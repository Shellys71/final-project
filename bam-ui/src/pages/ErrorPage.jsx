import Error from "../components/UI/Error";

const ErrorPage = (props) => {
  return <Error error={props.error}/>;
};

export default ErrorPage;