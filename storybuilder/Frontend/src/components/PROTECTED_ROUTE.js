import { Navigate } from "react-router-dom";
import { USE_AUTH } from "./AuthContext";

const PROTECTED_ROUTE = ({ children }) => {
  const { is_authenticated } = USE_AUTH();

  if (!is_authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PROTECTED_ROUTE;