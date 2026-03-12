import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
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

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    try {
      setError("");
      const res = await getMyReservations();
      const data = unwrapData(res);
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "예약 목록 조회에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!loginUser) return;
    fetchReservations();
  }, [loginUser]);

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  const handleCancel = async (reservationId) => {
    const ok = window.confirm("정말 이 예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelReservation(reservationId);
      alert("예약이 취소되었습니다.");
      fetchReservations();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "예약 취소에 실패했습니다.");
    }
  };

  return (
      <Container maxWidth="md">
        <Card sx={{ mt: 6, borderRadius: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              내 예약 목록
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            {reservations.length === 0 ? (
                <Typography sx={{ mt: 2 }}>예약 내역이 없습니다.</Typography>
            ) : (
                reservations.map((item, index) => (
                    <Box key={item.id} sx={{ py: 2 }}>
                      <Typography variant="body1" fontWeight="bold">
                        구장: {item.courtId}
                      </Typography>

                      <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                      >
                        예약 시간: {item.startTime}
                      </Typography>

                      {item.status && (
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                          >
                            상태: {item.status}
                          </Typography>
                      )}

                      <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/reservations/${item.id}`)}
                        >
                          상세보기
                        </Button>

                        {item.status !== "CANCELED" && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancel(item.id)}
                            >
                              예약 취소
                            </Button>
                        )}
                      </Stack>

                      {index !== reservations.length - 1 && (
                          <Divider sx={{ mt: 3 }} />
                      )}
                    </Box>
                ))
            )}
          </CardContent>
        </Card>
      </Container>
  );
}