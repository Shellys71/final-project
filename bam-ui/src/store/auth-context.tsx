import React, { useState, useCallback, useEffect } from "react";

import User from "../models/user";

type AuthContextObj = {
  token: string;
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextObj>({
  token: "",
  user: null,
  isLoggedIn: false,
  login: (token: string, user: User) => {},
  logout: () => {},
});

export const AuthContextProvider: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const userIsLoggedIn = !!user;

  useEffect(() => {
    const storedUserInformation = localStorage.getItem("user");
    setUser(JSON.parse(storedUserInformation!));
    const storedToken = localStorage.getItem("token");
    setToken(storedToken!);
  }, []);

  const logoutHandler = useCallback(() => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const loginHandler = (token: string, user: User) => {
    setToken(token);
    localStorage.setItem("token", token);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const contextValue: AuthContextObj = {
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
