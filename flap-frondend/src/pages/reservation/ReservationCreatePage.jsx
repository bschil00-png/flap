import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../../api/reservations";
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

  const handleCourtSelect = (courtId) => {
    setForm((prev) => ({
      ...prev,
      courtId,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.courtId) {
      setError("구장을 선택해주세요.");
      return;
    }

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