import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/auth-context";

const MainNavigation = () => {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
    navigate("/auth");
    // optional: redirect the user
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>ביטחון מידע</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">כניסה</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">איזור אישי</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/requests/create">בקשה חדשה</Link>
            </li>
          )}
          {user && user.isAdmin && (
            <li>
              <Link to="/requests/pending">בקשות לאישור</Link>
            </li>
          )}
          {user && user.isAdmin && (
            <li>
              <Link to="/requests/history">היסטוריית בקשות</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>התנתק</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
