import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { unwrapData } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(form);
      const data = unwrapData(res);

      console.log("로그인 응답:", data);
      alert("로그인 성공");
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      setError(err?.response?.data?.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 480, borderRadius: 5, boxShadow: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            로그인
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            이메일과 비밀번호를 입력해 로그인하세요.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="이메일"
                name="email"
                value={form.email}
                onChange={onChange}
                fullWidth
              />

              <TextField
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 3 }}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}