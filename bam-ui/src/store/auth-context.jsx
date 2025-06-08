import React, { useState, useCallback, useEffect } from "react";

const AuthContext = React.createContext({
  token: "",
  user: null,
  isLoggedIn: false,
  login: (token, user) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const userIsLoggedIn = !!user;

  useEffect(() => {
    const storedUserInformation = localStorage.getItem("user");
    setUser(JSON.parse(storedUserInformation));
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const logoutHandler = useCallback(() => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const loginHandler = (token, user) => {
    setToken(token);
    localStorage.setItem("token", token);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const contextValue = {
    token,
    user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
