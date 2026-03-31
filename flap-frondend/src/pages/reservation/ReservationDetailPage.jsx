import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getReservation, deleteReservation, cancelReservation } from "../../api/reservations";
import { unwrapData } from "../../api/client";
import { getLoginUser } from "../../utils/authStorage";
import {
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Button,
  Stack,
  Chip,
  Snackbar,
} from "@mui/material";

export default function ReservationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loginUser] = useState(() => getLoginUser());
  const loginUserId = loginUser?.id;

  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!loginUserId) return;

    const run = async () => {
      setError("");

      try {
        const res = await getReservation(id);
        const data = unwrapData(res);
        setReservation(data);
      } catch (err) {
        setError(err?.response?.data?.message || "예약 조회 실패");
      }
    };

    run();
  }, [id, loginUserId]);

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

  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteReservation(id);
      setSuccessMessage("예약이 삭제되었습니다.");
      setTimeout(() => navigate("/my-reservations"), 1000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "예약 삭제 실패");
    }
  };

  const handleCancel = async () => {
    const ok = window.confirm("정말 예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelReservation(id);
      setSuccessMessage("예약이 취소되었습니다.");

      const res = await getReservation(id);
      setReservation(unwrapData(res));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "예약 취소 실패");
    }
  };

  return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            예약 상세
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {!error && !reservation && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
          )}

          {reservation && (
              <Box sx={{ mt: 2 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {getCourtName(reservation.courtId)}
                  </Typography>
                  <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                  />
                </Stack>

                <Typography variant="body1">
                  <strong>예약 번호:</strong> {reservation.id}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="body1">
                  <strong>예약 시간:</strong> {formatDateTime(reservation.startTime)}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="body1">
                  <strong>생성일:</strong> {formatDateTime(reservation.createdAt)}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: "wrap" }}>
                  <Button
                      variant="outlined"
                      onClick={() => navigate("/my-reservations")}
                  >
                    목록으로
                  </Button>

                  {reservation.status === "BOOKED" && (
                      <>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                        >
                          수정하기
                        </Button>

                        <Button
                            variant="contained"
                            color="warning"
                            onClick={handleCancel}
                        >
                          예약 취소
                        </Button>
                      </>
                  )}

                  <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                  >
                    삭제하기
                  </Button>
                </Stack>
              </Box>
          )}
        </Paper>

        <Snackbar
            open={!!successMessage}
            autoHideDuration={1500}
            onClose={() => setSuccessMessage("")}
            message={successMessage}
        />
      </Container>
  );
}