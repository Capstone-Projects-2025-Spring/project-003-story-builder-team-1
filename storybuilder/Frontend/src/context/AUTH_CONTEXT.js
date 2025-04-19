import { createContext, useContext, useState, useEffect } from "react";

// const auth_context = createContext();

const auth_context = createContext({
  user: null,
  login_auth: () => {},
  logout_auth: () => {},
  is_authenticated: false,
});

export const AUTH_PROVIDER = ({ children }) => {
  const [user, set_user] = useState(null); // null means not logged in

  const login_auth = (user_data) => {
    const userId = user_data?.user_id;
    set_user(userId);
  };

  useEffect(() => {
  }, [user]);

  const logout_auth = () => {
    set_user(null);
  };

  const is_authenticated = !!user;

  return (
    <auth_context.Provider value={{ user, login_auth, logout_auth, is_authenticated }}>
      {children}
    </auth_context.Provider>
  );
};

export const USE_AUTH = () => useContext(auth_context);