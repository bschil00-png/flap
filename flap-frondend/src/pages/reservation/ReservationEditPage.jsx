import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { getReservation, updateReservation, getReservationSlots } from "../../api/reservations";
import { unwrapData } from "../../api/client";
import { getLoginUser } from "../../utils/authStorage";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";

export default function ReservationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const loginUserId = loginUser?.id;

  const [form, setForm] = useState({
    courtId: "",
    reservationDate: "",
    reservationHour: null,
  });
  const [reservation, setReservation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const timeSlots = useMemo(
      () =>
          Array.from({ length: 13 }, (_, i) => {
            const hour = 9 + i;
            return {
              hour,
              label: `${String(hour).padStart(2, "0")}:00 ~ ${String(hour + 1).padStart(2, "0")}:00`,
            };
          }),
      []
  );

  useEffect(() => {
    if (!loginUserId) return;

    const fetchReservation = async () => {
      try {
        setError("");
        const res = await getReservation(id);
        const data = unwrapData(res);

        if (String(data.memberId) !== String(loginUserId)) {
          navigate("/my-reservations", { replace: true });
          return;
        }

        const start = new Date(data.startTime);
        const yyyy = start.getFullYear();
        const mm = String(start.getMonth() + 1).padStart(2, "0");
        const dd = String(start.getDate()).padStart(2, "0");

        setReservation(data);
        setForm({
          courtId: data.courtId,
          reservationDate: `${yyyy}-${mm}-${dd}`,
          reservationHour: start.getHours(),
        });
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "예약 조회 실패");
      }
    };

    fetchReservation();
  }, [id, loginUserId, navigate]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.courtId || !form.reservationDate) {
        setSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        const res = await getReservationSlots(Number(form.courtId), form.reservationDate);
        const data = res?.data ?? [];
        setSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [form.courtId, form.reservationDate]);

  if (!loginUserId) {
    return <Navigate to="/login" replace />;
  }

  const slotMap = new Map(slots.map((slot) => [slot.hour, slot]));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.reservationDate || form.reservationHour === null) {
      setError("날짜와 시간을 선택해주세요.");
      return;
    }

    const startTime = `${form.reservationDate}T${String(form.reservationHour).padStart(2, "0")}:00:00`;

    try {
      await updateReservation(id, {
        startTime,
      });

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
        setError("이미 예약된 시간입니다.");
      } else {
        setError(message);
      }
    }
  };

  return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            예약 수정
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <TextField
                label="예약 날짜"
                type="date"
                value={form.reservationDate}
                onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      reservationDate: e.target.value,
                      reservationHour: null,
                    }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ mb: 3 }}
            />

            {loadingSlots ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={1.5}>
                  {timeSlots.map((slot) => {
                    const slotInfo = slotMap.get(slot.hour);
                    const isCurrentReservation =
                        reservation &&
                        new Date(reservation.startTime).getHours() === slot.hour &&
                        form.reservationDate === reservation.startTime.slice(0, 10);

                    const available = slotInfo?.available ?? true;
                    const disabled = !available && !isCurrentReservation;
                    const selected = form.reservationHour === slot.hour;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={slot.hour}>
                          <Button
                              fullWidth
                              variant={selected ? "contained" : "outlined"}
                              disabled={disabled}
                              onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    reservationHour: slot.hour,
                                  }))
                              }
                              sx={{ py: 1.5, borderRadius: 3 }}
                          >
                            {slot.label}
                          </Button>
                        </Grid>
                    );
                  })}
                </Grid>
            )}

            <Button type="submit" variant="contained" sx={{ mt: 4 }}>
              수정 완료
            </Button>
          </Box>
        </Paper>
      </Container>
  );
}