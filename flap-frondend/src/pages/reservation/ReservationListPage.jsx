import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReservations } from "../../api/reservations";
import { unwrapData } from "../../api/client";

export default function ReservationListPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getReservations();
        const data = unwrapData(res);
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("예약 목록 조회 실패:", err);
        setError(err?.response?.data?.message || "예약 목록 조회 실패");
      }
    };

    fetchReservations();
  }, []);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            예약 목록
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            등록된 예약 정보를 확인할 수 있습니다.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/reservations/new"
          variant="contained"
          sx={{ borderRadius: 3 }}
        >
          새 예약 등록
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reservations.map((reservation) => (
          <Grid item xs={12} sm={6} md={4} key={reservation.id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  예약 #{reservation.id}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  회원 ID: {reservation.memberId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  코트 ID: {reservation.courtId}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  시작 시간: {reservation.startTime}
                </Typography>

                <Button
                  component={RouterLink}
                  to={`/reservations/${reservation.id}`}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                >
                  상세 보기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
