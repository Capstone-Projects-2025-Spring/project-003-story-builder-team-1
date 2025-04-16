import { createContext, useContext, useState } from "react";

const auth_context = createContext();

export const AUTH_PROVIDER = ({ children }) => {
  const [user, set_user] = useState(null); // null means not logged in

  const login = (user_data) => {
    set_user(user_data);
  };

  const logout = () => {
    set_user(null);
  };

  const is_authenticated = !!user;

  return (
    <auth_context.Provider value={{ user, login, logout, is_authenticated }}>
      {children}
    </auth_context.Provider>
  );
};

export const USE_AUTH = () => useContext(auth_context);