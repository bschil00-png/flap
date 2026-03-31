import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Snackbar,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import {
  cancelReservation,
  getMyReservations,
} from "../../api/reservations";
import { unwrapData } from "../../api/client";
import { getLoginUser } from "../../utils/authStorage";

export default function MyReservationListPage() {
  const navigate = useNavigate();
  const loginUser = getLoginUser();
  const loginUserId = loginUser?.id;

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setError("");
      const res = await getMyReservations();
      const data = unwrapData(res);
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "예약 목록 조회에 실패했습니다.");
    }
  }, []);

  useEffect(() => {
    if (!loginUserId) return;
    fetchReservations();
  }, [loginUserId, fetchReservations]);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [reservations]);

  if (!loginUserId) {
    return <Navigate to="/login" replace />;
  }

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCourtName = (courtId) => {
    if (courtId === 1) return "구장 A";
    if (courtId === 2) return "구장 B";
    return `구장 ${courtId}`;
  };

  const getStatusLabel = (status) => {
    if (status === "BOOKED") return "예약 완료";
    if (status === "CANCELED") return "취소됨";
    if (status === "COMPLETED") return "이용 완료";
    return status;
  };

  const getStatusColor = (status) => {
    if (status === "BOOKED") return "primary";
    if (status === "CANCELED") return "default";
    if (status === "COMPLETED") return "success";
    return "default";
  };

  const handleCancel = async (reservationId) => {
    const ok = window.confirm("정말 이 예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelReservation(reservationId);
      setSuccessMessage("예약이 취소되었습니다.");
      fetchReservations();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "예약 취소에 실패했습니다.");
    }
  };

  return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            내 예약
          </Typography>
          <Typography variant="body1" color="text.secondary">
            예약 내역과 상태를 확인할 수 있습니다.
          </Typography>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
        )}

        {sortedReservations.length === 0 ? (
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography>예약 내역이 없습니다.</Typography>
              </CardContent>
            </Card>
        ) : (
            <Grid container spacing={3}>
              {sortedReservations.map((item) => (
                  <Grid item xs={12} md={6} key={item.id}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2, height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            {getCourtName(item.courtId)}
                          </Typography>
                          <Chip
                              label={getStatusLabel(item.status)}
                              color={getStatusColor(item.status)}
                              size="small"
                          />
                        </Stack>

                        <Stack spacing={1.2}>
                          <Typography variant="body2" color="text.secondary">
                            예약 번호: {item.id}
                          </Typography>
                          <Typography variant="body1">
                            예약 시간: {formatDateTime(item.startTime)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            생성일: {formatDateTime(item.createdAt)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                          <Button
                              variant="outlined"
                              onClick={() => navigate(`/reservations/${item.id}`)}
                          >
                            상세보기
                          </Button>

                          {item.status === "BOOKED" && (
                              <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleCancel(item.id)}
                              >
                                예약 취소
                              </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}

        <Snackbar
            open={!!successMessage}
            autoHideDuration={1500}
            onClose={() => setSuccessMessage("")}
            message={successMessage}
        />
      </Container>
  );
}