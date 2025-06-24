import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  Fragment,
} from "react";

import classes from "./PendingRequests.module.css";
import AuthContext from "../../../../store/auth-context";
import useHttp from "../../../../hooks/use-http";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import PendingRequestItem from "./PendingRequestItem";
import ChangeStateModal from "./Modals/ChangeStateModal";
import CategorySelection from "./CategorySelection";
import ErrorPage from "../../../../pages/ErrorPage";
import { State } from "../../../../utils/request";

const RequestsList = () => {
  const [pendingRequestList, setPendingRequestList] = useState([]);
  const [sortedPendingRequestList, setSortedPendingRequestList] = useState([]);
  const [modalIsShown, setModalIsShown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState("");
  const [currentRequestOwner, setCurrentRequestOwner] = useState("");
  const [showNotExistingError, setShowNotExistingError] = useState(false);

  const detailsInputRef = useRef();

  const { isLoading, error, sendRequest: sendUserRequest } = useHttp();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests?state=pending`,
        headers: { Authorization: authCtx.token },
      },
      (data) => {
        setPendingRequestList(data);
      }
    );
  }, [sendUserRequest, authCtx.token]);

  const approvedStateRequest = () => {
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests/${currentRequestId}`,
        method: "PATCH",
        headers: {
          Authorization: authCtx.token,
          "Content-Type": "application/json",
        },
        body: {
          status: {
            state: State.APPROVED,
          },
        },
      },
      hideModalHandler
    );
  };

  const rejectedStateRequest = () => {
    let enteredDetails;
    if (detailsInputRef) {
      enteredDetails = detailsInputRef.current.value;
    }
    sendUserRequest(
      {
        url: `${process.env.REACT_APP_HOST}/requests/${currentRequestId}`,
        method: "PATCH",
        headers: {
          Authorization: authCtx.token,
          "Content-Type": "application/json",
        },
        body: {
          status: {
            state: State.REJECTED,
            details: enteredDetails,
          },
        },
      },
      hideModalHandler
    );
  };

  const hideModalHandler = () => {
    setModalIsShown(false);
  };

  const approveRequestHandler = (requestId, ownerName) => {
    setCurrentRequestOwner(ownerName);
    setCurrentRequestId(requestId);
    setModalIsShown(true);
    setSelectedState(State.APPROVED);
  };

  const rejectRequestHandler = (requestId, ownerName) => {
    setCurrentRequestOwner(ownerName);
    setCurrentRequestId(requestId);
    setModalIsShown(true);
    setSelectedState(State.REJECTED);
  };

  const sortByCategoryHandler = (category) => {
    const sortedPendingList = pendingRequestList.filter((request) => {
      setShowNotExistingError(false);
      return request.description === category;
    });
    if (sortedPendingList.length === 0 && category !== "") {
      setShowNotExistingError(true);
    }
    setSortedPendingRequestList(sortedPendingList);
  };

  const sortedListExists = sortedPendingRequestList.length > 0;
  const currentPendingList = sortedListExists
    ? sortedPendingRequestList
    : pendingRequestList;
  const notExistingError = (
    <p className={classes.error}>אין בקשות פתוחות מסוג זה</p>
  );

  const pageContent = (
    <Fragment>
      <h1>בקשות פתוחות</h1>
      <CategorySelection onCategoryChange={sortByCategoryHandler} />
      {showNotExistingError && notExistingError}
      <div className={classes.container}>
        {currentPendingList.length !== 0 ? (
          currentPendingList.map((request) => (
            <PendingRequestItem
              key={request._id}
              ownerName={request.owner.name}
              description={request.description}
              explanation={request.explanation}
              createdAt={request.createdAt.slice(0, 10)}
              onApprove={approveRequestHandler.bind(
                null,
                request._id,
                request.owner.name
              )}
              onReject={rejectRequestHandler.bind(
                null,
                request._id,
                request.owner.name
              )}
            />
          ))
        ) : (
          <p>אין בקשות פתוחות כרגע</p>
        )}
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {error ? (
        <ErrorPage error={error} />
      ) : (
        <section className={classes.section}>
          {isLoading && <LoadingSpinner />}
          {!error && !isLoading && pageContent}
          {modalIsShown && (
            <ChangeStateModal
              ownerName={currentRequestOwner}
              onClose={hideModalHandler}
              selectedState={selectedState}
              approveRequest={approvedStateRequest}
              rejectRequest={rejectedStateRequest}
              detailsInputRef={detailsInputRef}
            />
          )}
        </section>
      )}
    </Fragment>
  );
};

export default RequestsList;
