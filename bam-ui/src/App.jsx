import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { socket } from "./socket";

import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import AuthContext from "./store/auth-context";
import HomePage from "./pages/HomePage";
import UserProfile from "./components/Profile/UserProfile";
import NewRequestsPage from "./pages/NewRequestsPage";
import PendingRequestsPage from "./pages/PendingRequestsPage";
import RequestsHistoryPage from "./pages/RequestsHistoryPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const authCtx = useContext(AuthContext);

  const pageNotFoundObject = {
    code: 404,
    info: "Not Found",
  };

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      socket.connect();
    }

    function onConnect() {
      console.log("Connected successfuly!");
    }

    function onDisconnect() {
      console.log("Disconnected successfuly!");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [authCtx.isLoggedIn]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!authCtx.isLoggedIn && <Route path="/auth" element={<AuthPage />} />}
        {!authCtx.isLoggedIn && (
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="/requests/create" element={<NewRequestsPage />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="/requests/pending" element={<PendingRequestsPage />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="/requests/history" element={<RequestsHistoryPage />} />
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/profile" element={<Navigate to="/auth" />} />
        )}
        <Route path="*" element={<ErrorPage error={pageNotFoundObject} />} />
      </Routes>
    </Layout>
  );
}

export default App;
