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
import { createReservation } from "../api/reservations";
import { unwrapData } from "../api/client";

export default function ReservationCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    memberId: "",
    courtId: "",
    startTime: "",
  });

  const [error, setError] = useState("");

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
        memberId: Number(form.memberId),
        courtId: Number(form.courtId),
        startTime: form.startTime,
      };

      const res = await createReservation(payload);
      const data = unwrapData(res);

      alert("예약 등록 성공");

      if (data?.id) {
        navigate(`/reservations/${data.id}`);
        return;
      }

      navigate("/reservations");
    } catch (err) {
      console.error("예약 등록 실패:", err);
      setError(err?.response?.data?.message || "예약 등록 실패");
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
      <Card sx={{ width: "100%", maxWidth: 520, borderRadius: 5, boxShadow: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            예약 등록
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            회원과 코트, 시작 시간을 입력해 예약을 등록하세요.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="회원 ID"
                name="memberId"
                type="number"
                value={form.memberId}
                onChange={onChange}
                fullWidth
              />

              <TextField
                label="코트 ID"
                name="courtId"
                type="number"
                value={form.courtId}
                onChange={onChange}
                fullWidth
              />

              <TextField
                label="시작 시간"
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={onChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ py: 1.5, borderRadius: 3 }}
              >
                예약 등록
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}