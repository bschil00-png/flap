import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import {
  createReservation,
  getReservedSlots,
} from "../../api/reservations";
import { getLoginUser } from "../../utils/authStorage";

export default function ReservationCreatePage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const courts = [
    {
      id: 1,
      name: "구장 A",
      imageUrl: "/images/flap-a.jfif",
    },
    {
      id: 2,
      name: "구장 B",
      imageUrl: "/images/flap-b.jfif",
    },
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i;
    const nextHour = hour + 1;

    return {
      value: String(hour).padStart(2, "0"),
      label: `${String(hour).padStart(2, "0")}:00 ~ ${String(nextHour).padStart(2, "0")}:00`,
    };
  });

  const [form, setForm] = useState({
    courtId: "",
    reservationDate: "",
    reservationHour: "",
  });

  const [reservedHours, setReservedHours] = useState([]);
  const [error, setError] = useState("");

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCourtSelect = (courtId) => {
    setForm((prev) => ({
      ...prev,
      courtId,
      reservationHour: "",
    }));
  };

  useEffect(() => {
    const fetchReservedSlots = async () => {
      if (!form.courtId || !form.reservationDate) {
        setReservedHours([]);
        return;
      }

      try {
        const res = await getReservedSlots(
            Number(form.courtId),
            form.reservationDate
        );

        const data = res?.data ?? [];
        setReservedHours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("예약된 시간 조회 실패:", err);
        setReservedHours([]);
      }
    };

    fetchReservedSlots();
  }, [form.courtId, form.reservationDate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.courtId) {
      setError("구장을 선택해주세요.");
      return;
    }

    if (!form.reservationDate) {
      setError("예약 날짜를 선택해주세요.");
      return;
    }

    if (!form.reservationHour) {
      setError("예약 시간을 선택해주세요.");
      return;
    }

    const selectedHourNumber = Number(form.reservationHour);

    if (reservedHours.includes(selectedHourNumber)) {
      setError("선택한 시간에 이미 예약된 구장입니다.");
      return;
    }

    const startTime = `${form.reservationDate}T${form.reservationHour}:00:00`;

    try {
      await createReservation({
        courtId: Number(form.courtId),
        startTime,
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
          message.includes("중복") ||
          message.includes("이미 예약된 시간") ||
          message.includes("이미 예약된 구장")
      ) {
        setError("선택한 시간에 이미 예약된 구장입니다.");
      } else {
        setError(message);
      }
    }
  };

  return (
      <Container maxWidth="md">
        <Card sx={{ mt: 6, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              예약하기
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            <Stack spacing={3} component="form" onSubmit={onSubmit}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  구장 선택
                </Typography>

                <Grid container spacing={2}>
                  {courts.map((court) => {
                    const selected = Number(form.courtId) === court.id;

                    return (
                        <Grid item xs={12} sm={6} key={court.id}>
                          <Card
                              onClick={() => handleCourtSelect(court.id)}
                              sx={{
                                cursor: "pointer",
                                borderRadius: 3,
                                overflow: "hidden",
                                border: selected
                                    ? "3px solid #1976d2"
                                    : "1px solid #ddd",
                                boxShadow: selected ? 6 : 2,
                                transform: selected ? "scale(1.02)" : "scale(1)",
                                transition: "all 0.2s ease",
                              }}
                          >
                            <CardMedia
                                component="img"
                                height="220"
                                image={court.imageUrl}
                                alt={court.name}
                            />
                            <CardContent>
                              <Typography variant="h6" fontWeight="bold">
                                {court.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selected ? "선택됨" : "이미지를 클릭해서 선택"}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                    );
                  })}
                </Grid>
              </Box>

              <TextField
                  label="예약 날짜"
                  name="reservationDate"
                  type="date"
                  value={form.reservationDate}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
              />

              <TextField
                  select
                  label="예약 시간"
                  name="reservationHour"
                  value={form.reservationHour}
                  onChange={onChange}
                  fullWidth
                  required
                  helperText={
                    form.courtId && form.reservationDate
                        ? "예약된 시간은 선택할 수 없습니다."
                        : "구장과 날짜를 먼저 선택해주세요."
                  }
              >
                {timeSlots.map((slot) => {
                  const hourNumber = Number(slot.value);
                  const reserved = reservedHours.includes(hourNumber);

                  return (
                      <MenuItem
                          key={slot.value}
                          value={slot.value}
                          disabled={reserved}
                      >
                        {slot.label} {reserved ? "(예약됨)" : ""}
                      </MenuItem>
                  );
                })}
              </TextField>

              <Button type="submit" variant="contained" size="large">
                예약하기
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
  );
}