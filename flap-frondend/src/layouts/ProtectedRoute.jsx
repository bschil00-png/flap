import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe, refresh } from "../api/auth";
import { clearLoginUser, saveLoginUser } from "../utils/authStorage";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const meRes = await getMe();
        saveLoginUser(meRes.data);
        setAuthenticated(true);
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          try {
            await refresh();
            const meRes = await getMe();
            saveLoginUser(meRes.data);
            setAuthenticated(true);
          } catch (e) {
            clearLoginUser();
            setAuthenticated(false);
          }
        } else {
          clearLoginUser();
          setAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}