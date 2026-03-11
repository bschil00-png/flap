import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { getReservation, updateReservation } from "../../api/reservations";
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

export default function ReservationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const [form, setForm] = useState({
    memberId: "",
    courtId: "",
    startTime: "",
  });
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!loginUser) return;

    const fetchReservation = async () => {
      try {
        const res = await getReservation(id);
        const data = unwrapData(res);

        if (String(data.memberId) !== String(loginUser.id)) {
          setForbidden(true);
          return;
        }

        setForm({
          memberId: data.memberId || "",
          courtId: data.courtId || "",
          startTime: formatDateTimeLocal(data.startTime) || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "예약 조회 실패");
      }
    };

    fetchReservation();
  }, [id, loginUser]);

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  if (forbidden) {
    return <Navigate to="/my-reservations" replace />;
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
        courtId: Number(form.courtId),
        startTime: form.startTime,
      };

      await updateReservation(id, payload);
      alert("예약 수정 성공");
      navigate(`/reservations/${id}`);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "예약 수정 실패";

      if (
        status === 409 ||
        message.includes("unique") ||
        message.includes("already") ||
        message.includes("중복")
      ) {
        setError("이미 예약된 구장입니다.");
      } else {
        setError(message);
      }
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

function formatDateTimeLocal(value) {
  if (!value) return "";
  return value.length >= 16 ? value.slice(0, 16) : value;
}