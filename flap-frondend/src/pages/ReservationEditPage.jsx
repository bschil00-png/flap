import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReservation, updateReservation } from "../api/reservations";
import { unwrapData } from "../api/client";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function ReservationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    memberId: "",
    courtId: "",
    startTime: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await getReservation(id);
        const data = unwrapData(res);

        setForm({
          memberId: data.memberId || "",
          courtId: data.courtId || "",
          startTime: data.startTime || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "예약 조회 실패");
      }
    };

    fetchReservation();
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
      const payload = {
        courtId: Number(form.courtId),
        startTime: form.startTime,
      };

      await updateReservation(id, payload);
      alert("예약 수정 성공");
      navigate(`/reservations/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "예약 수정 실패");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          예약 수정
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="회원 ID"
            name="memberId"
            value={form.memberId}
            fullWidth
            disabled
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

          <Button type="submit" variant="contained">
            수정 완료
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}