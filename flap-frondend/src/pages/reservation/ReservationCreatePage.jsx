import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../../api/reservations";
import { getLoginUser } from "../../utils/authStorage";

export default function ReservationCreatePage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const [form, setForm] = useState({
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
      await createReservation({
        memberId: loginUser.id,
        courtId: Number(form.courtId),
        startTime: form.startTime,
      });

      alert("예약이 완료되었습니다.");
      navigate("/my-reservations");
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;
      const message = err?.response?.data?.message || "예약에 실패했습니다.";

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
    <Container maxWidth="sm">
      <Card sx={{ mt: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            예약하기
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2} component="form" onSubmit={onSubmit}>
            <TextField
              select
              label="구장 선택"
              name="courtId"
              value={form.courtId}
              onChange={onChange}
              fullWidth
              required
            >
              <MenuItem value={1}>구장 A</MenuItem>
              <MenuItem value={2}>구장 B</MenuItem>
            </TextField>

            <TextField
              label="예약 시간"
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" size="large">
              예약하기
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
