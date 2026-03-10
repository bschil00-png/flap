import { Navigate } from "react-router-dom";
import { getLoginUser } from "../utils/authStorage";

export default function ProtectedRoute({ children }) {
  const loginUser = getLoginUser();

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}