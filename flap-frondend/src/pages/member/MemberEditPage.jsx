import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { getMyMember, updateMember } from "../../api/members";
import { unwrapData } from "../../api/client";
import { getLoginUser } from "../../utils/authStorage";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function MemberEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loginUser] = useState(() => getLoginUser());
  const loginUserId = loginUser?.id;

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loginUserId) return;
    if (String(loginUserId) !== String(id)) return;

    const fetchMember = async () => {
      try {
        setError("");
        const res = await getMyMember();
        const data = unwrapData(res);

        setForm({
          email: data?.email || "",
          name: data?.name || "",
          password: "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "회원 조회 실패");
      }
    };

    fetchMember();
  }, [id, loginUserId]);

  if (!loginUserId) {
    return <Navigate to="/login" replace />;
  }

  if (String(loginUserId) !== String(id)) {
    return <Navigate to="/" replace />;
  }

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        ...(form.password.trim() && { password: form.password }),
      };

      await updateMember(id, payload);
      alert("회원 수정 성공");
      navigate(`/members/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "회원 수정 실패");
    }
  };

  return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            내 정보 수정
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
                label="이메일"
                name="email"
                value={form.email}
                fullWidth
                disabled
            />

            <TextField
                label="이름"
                name="name"
                value={form.name}
                onChange={onChange}
                fullWidth
            />

            <TextField
                label="새 비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                fullWidth
            />

            <Button type="submit" variant="contained">
              수정 완료
            </Button>
          </Box>
        </Paper>
      </Container>
  );
}