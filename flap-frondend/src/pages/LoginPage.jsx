import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { unwrapData } from "../api/client";
import { saveLoginUser } from "../utils/authStorage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      const loginUser = unwrapData(res);

      saveLoginUser(loginUser);
      alert("로그인 성공");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            mx: "auto",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              로그인
            </Typography>

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
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
                <Button type="submit" variant="contained" size="large">
                  로그인
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}