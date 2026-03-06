import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box, Button } from "@mui/material";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Exercise Front
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          React + Spring Boot 기반 회원관리 연습 프로젝트
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/members/new")}
          >
            회원가입
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/members")}
          >
            회원목록
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}