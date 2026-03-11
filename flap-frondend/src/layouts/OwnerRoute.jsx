import { Navigate, useParams } from "react-router-dom";
import { getLoginUser } from "../utils/authStorage";

export default function OwnerRoute({ children }) {
  const loginUser = getLoginUser();
  const { id } = useParams();

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  if (String(loginUser.id) !== String(id)) {
    return <Navigate to="/" replace />;
  }

  return children;
}