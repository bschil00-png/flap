import { useEffect, useState } from "react";
import AppRouter from "./routes/AppRouter";
import { getMe, refresh } from "./api/auth";
import { clearLoginUser, saveLoginUser } from "./utils/authStorage";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restoreLogin = async () => {
      try {
        const meRes = await getMe();
        saveLoginUser(meRes.data);
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          try {
            await refresh();

            const meRes = await getMe();
            saveLoginUser(meRes.data);
          } catch (refreshErr) {
            clearLoginUser();
          }
        } else {
          clearLoginUser();
        }
      } finally {
        setReady(true);
      }
    };

    restoreLogin();
  }, []);

  if (!ready) {
    return <div>로딩중...</div>;
  }

  return <AppRouter />;
}