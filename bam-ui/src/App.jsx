import React, { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router";

import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import AuthContext from "./store/auth-context";


// import axios from "axios";

function App() {
  const authCtx = useContext(AuthContext);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/bam/welcome")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <Layout>
      <h1>{message}</h1>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {!authCtx.isLoggedIn && <Route path="/auth" element={<AuthPage />} />}
        {/* {authCtx.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/profile" element={<Navigate to="/auth" />} />
        )}
        <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;
