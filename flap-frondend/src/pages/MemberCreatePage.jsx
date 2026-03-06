import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../api/members";

import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function MemberCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
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
    setLoading(true);

    try {
      const res = await createMember(form);
      alert("회원가입 성공!");

      if (res?.data?.id) {
        navigate(`/members/${res.data.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            회원가입
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            회원 정보를 입력해주세요.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="이메일"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            fullWidth
            required
          />

          <TextField
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            fullWidth
            required
          />

          <TextField
            label="이름"
            name="name"
            value={form.name}
            onChange={onChange}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.5 }}
          >
            {loading ? "가입 중..." : "가입하기"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}