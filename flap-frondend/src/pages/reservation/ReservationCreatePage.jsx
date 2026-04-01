import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  createReservation,
  getReservationSlots,
} from "../../api/reservations";
import { getLoginUser } from "../../utils/authStorage";
import flapA from "../../assets/flap-a.jpg";
import flapB from "../../assets/flap-b.jpg";

export default function ReservationCreatePage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const courts = [
    {
      id: 1,
      name: "구장 A",
      imageUrl: flapA,
      location: "실내 구장",
      desc: "날씨 영향 없이 이용 가능한 실내 풋살장",
    },
    {
      id: 2,
      name: "구장 B",
      imageUrl: flapB,
      location: "실외 구장",
      desc: "개방감 있는 실외 풋살장",
    },
  ];

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

  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [reservationDate, setReservationDate] = useState(
      dayjs().format("YYYY-MM-DD")
  );
  const [selectedHour, setSelectedHour] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  const selectedCourt = courts.find(
      (court) => court.id === Number(selectedCourtId)
  );

  const selectedTimeLabel =
      selectedHour !== null
          ? `${String(selectedHour).padStart(2, "0")}:00 ~ ${String(
              selectedHour + 1
          ).padStart(2, "0")}:00`
          : "-";

  const isFormReady =
      !!selectedCourtId && !!reservationDate && selectedHour !== null;

  const handleCourtSelect = (courtId) => {
    setSelectedCourtId(courtId);
    setSelectedHour(null);
  };

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedCourtId || !reservationDate) {
        setSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        const res = await getReservationSlots(
            Number(selectedCourtId),
            reservationDate
        );
        const data = res?.data ?? [];
        setSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("예약 슬롯 조회 실패:", err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedCourtId, reservationDate]);

  const slotMap = useMemo(() => {
    const map = new Map();
    slots.forEach((slot) => {
      map.set(slot.hour, slot);
    });
    return map;
  }, [slots]);

  const getSlotStatusLabel = (reason) => {
    if (reason === "RESERVED") return "예약 마감";
    if (reason === "PAST") return "지난 시간";
    if (reason === "CUTOFF") return "예약 마감 임박";
    return "";
  };

  const handleReservation = async () => {
    setError("");

    if (!selectedCourtId) {
      setError("구장을 선택해주세요.");
      return;
    }

    if (!reservationDate) {
      setError("예약 날짜를 선택해주세요.");
      return;
    }

    if (selectedHour === null) {
      setError("예약 시간을 선택해주세요.");
      return;
    }

    const selectedSlot = slotMap.get(selectedHour);

    if (!selectedSlot || !selectedSlot.available) {
      setError("선택한 시간은 예약할 수 없습니다.");
      return;
    }

    const startTime = `${reservationDate}T${String(selectedHour).padStart(
        2,
        "0"
    )}:00:00`;

    try {
      await createReservation({
        courtId: Number(selectedCourtId),
        startTime,
      });

      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/my-reservations");
      }, 1000);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "예약에 실패했습니다.";

      if (
          status === 409 ||
          message.includes("unique") ||
          message.includes("already") ||
          message.includes("중복") ||
          message.includes("이미 예약")
      ) {
        setError("선택한 시간에 이미 예약된 구장입니다.");
      } else {
        setError(message);
      }
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              구장 예약
            </Typography>
            <Typography variant="body1" color="text.secondary">
              날짜와 시간을 선택해 원하는 구장을 예약하세요.
            </Typography>
          </Box>

          {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
          )}

          <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "flex-start",
                flexDirection: { xs: "column", md: "row" },
              }}
          >
            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    1. 구장 선택
                  </Typography>

                  <Grid container spacing={2}>
                    {courts.map((court) => {
                      const selected = Number(selectedCourtId) === court.id;

                      return (
                          <Grid item xs={12} sm={6} key={court.id}>
                            <Card
                                onClick={() => handleCourtSelect(court.id)}
                                sx={{
                                  cursor: "pointer",
                                  borderRadius: 4,
                                  overflow: "hidden",
                                  border: selected
                                      ? "2px solid #1976d2"
                                      : "1px solid #e0e0e0",
                                  boxShadow: selected ? 6 : 1,
                                  transform: selected ? "translateY(-2px)" : "none",
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
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 1 }}
                                >
                                  <Typography variant="h6" fontWeight="bold">
                                    {court.name}
                                  </Typography>
                                  {selected && (
                                      <Chip
                                          label="선택됨"
                                          color="primary"
                                          size="small"
                                      />
                                  )}
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                  {court.location}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {court.desc}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      );
                    })}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    2. 날짜 선택
                  </Typography>

                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 4,
                        p: 1,
                        backgroundColor: "#fafafa",
                        width: "fit-content",
                        mx: "auto",
                      }}
                  >
                    <DateCalendar
                        value={reservationDate ? dayjs(reservationDate) : null}
                        onChange={(newValue) => {
                          if (!newValue) return;
                          setReservationDate(newValue.format("YYYY-MM-DD"));
                          setSelectedHour(null);
                        }}
                        disablePast
                        sx={{
                          width: 280,
                          minHeight: 300,
                          "& .MuiPickersCalendarHeader-root": {
                            paddingLeft: 1,
                            paddingRight: 1,
                            marginTop: 0,
                            minHeight: 44,
                          },
                          "& .MuiDayCalendar-header": {
                            justifyContent: "space-around",
                          },
                          "& .MuiDayCalendar-weekContainer": {
                            justifyContent: "space-around",
                          },
                          "& .MuiPickersDay-root": {
                            fontSize: "0.85rem",
                            width: 32,
                            height: 32,
                            margin: "0 2px",
                          },
                        }}
                    />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      선택 날짜
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {reservationDate}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    3. 시간 선택
                  </Typography>

                  {!selectedCourtId || !reservationDate ? (
                      <Alert severity="info">
                        구장과 날짜를 먼저 선택해주세요.
                      </Alert>
                  ) : (
                      <>
                        {loadingSlots && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                              예약 가능 시간을 불러오는 중입니다...
                            </Typography>
                        )}

                        <Grid container spacing={1.5}>
                          {timeSlots.map((slot) => {
                            const slotInfo = slotMap.get(slot.hour);
                            const available = slotInfo?.available ?? !loadingSlots;
                            const reason = slotInfo?.reason ?? null;
                            const selected = selectedHour === slot.hour;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={slot.hour}>
                                  <Button
                                      type="button"
                                      fullWidth
                                      variant={selected ? "contained" : "outlined"}
                                      disabled={!available}
                                      onClick={() => setSelectedHour(slot.hour)}
                                      sx={{
                                        py: 1.5,
                                        minHeight: 72,
                                        borderRadius: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                      }}
                                  >
                                    <Typography fontWeight="bold">
                                      {slot.label}
                                    </Typography>
                                    {!available && (
                                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                                          {getSlotStatusLabel(reason) || "선택 불가"}
                                        </Typography>
                                    )}
                                  </Button>
                                </Grid>
                            );
                          })}
                        </Grid>
                      </>
                  )}
                </CardContent>
              </Card>
            </Box>

            <Box
                sx={{
                  width: { xs: "100%", md: 320 },
                  flexShrink: 0,
                  position: { xs: "static", md: "sticky" },
                  top: { md: 24 },
                  alignSelf: { md: "flex-start" },
                }}
            >
              <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    예약 요약
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        선택 구장
                      </Typography>
                      <Typography fontWeight="bold">
                        {selectedCourt?.name || "-"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        예약 날짜
                      </Typography>
                      <Typography fontWeight="bold">
                        {reservationDate || "-"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        예약 시간
                      </Typography>
                      <Typography fontWeight="bold">
                        {selectedTimeLabel}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                      type="button"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={!isFormReady}
                      onClick={handleReservation}
                      sx={{ mt: 4, borderRadius: 3, py: 1.5 }}
                  >
                    예약하기
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Snackbar
              open={successOpen}
              autoHideDuration={1200}
              onClose={() => setSuccessOpen(false)}
              message="예약이 완료되었습니다."
          />
        </Container>
      </LocalizationProvider>
  );
}