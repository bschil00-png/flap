import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservation, deleteReservation } from "../api/reservations";
import { unwrapData } from "../api/client";
import {
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Button,
} from "@mui/material";

export default function ReservationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [id]);

  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteReservation(id);
      alert("예약 삭제 성공");
      navigate("/reservations");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "예약 삭제 실패");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          예약 상세
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && !reservation && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {reservation && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>ID:</strong> {reservation.id}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
              <strong>회원 ID:</strong> {reservation.memberId}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
              <strong>코트 ID:</strong> {reservation.courtId}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
              <strong>시작 시간:</strong> {reservation.startTime}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {reservation.status && (
              <>
                <Typography variant="body1">
                  <strong>상태:</strong> {reservation.status}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => navigate("/reservations")}
            >
              목록으로
            </Button>

            <Button
              variant="contained"
              sx={{ mt: 3, ml: 2 }}
              onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
            >
              수정하기
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3, ml: 2 }}
              onClick={handleDelete}
            >
              삭제하기
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}