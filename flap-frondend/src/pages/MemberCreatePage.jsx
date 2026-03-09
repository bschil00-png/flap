import {
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
import { createMember } from "../api/members";

export default function MemberCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
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
      const res = await createMember(form);
      console.log("회원가입 응답:", res.data);

      alert("회원가입 성공");

      // 백엔드가 MemberResponse를 바로 주는 경우
      if (res?.data?.id) {
        navigate(`/members/${res.data.id}`);
        return;
      }

      // 혹시 ApiResponse로 감싸서 주는 경우
      if (res?.data?.data?.id) {
        navigate(`/members/${res.data.data.id}`);
        return;
      }

      navigate("/members");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert(err?.response?.data?.message || "회원가입 실패");
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
      <Card
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 5,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            회원가입
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            새로운 회원 정보를 입력하고 등록하세요.
          </Typography>

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

              <TextField
                label="이름"
                name="name"
                value={form.name}
                onChange={onChange}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 1, py: 1.5, borderRadius: 3 }}
              >
                가입하기
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}