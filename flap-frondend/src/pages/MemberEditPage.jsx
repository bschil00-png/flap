import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMember, updateMember } from "../api/members";
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

  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await getMember(id);
        setForm({
          name: res.data.name || "",
          password: "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "회원 조회 실패");
      }
    };

    fetchMember();
  }, [id]);

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
      await updateMember(id, form);
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
          회원 수정
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
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