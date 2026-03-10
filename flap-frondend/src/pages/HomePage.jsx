import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center" sx={{ minHeight: "75vh" }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            React + Spring Boot Project
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 2,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
            }}
          >
            회원 관리를
            <br />
            더 깔끔하고 쉽게
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mb: 4, maxWidth: 520 }}
          >
            회원 등록, 조회, 수정, 삭제와 예약 등록/조회 기능을
            실제 서비스처럼 연습할 수 있는 관리자형 웹 화면입니다.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={RouterLink}
              to="/members/new"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3 }}
            >
              회원가입 시작하기
            </Button>

            <Button
              component={RouterLink}
              to="/members"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3 }}
            >
              회원목록 보기
            </Button>

            <Button
              component={RouterLink}
              to="/reservations"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3 }}
            >
              예약목록 보기
            </Button>


          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 5, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    빠른 회원 관리
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    등록부터 조회까지 한 화면 흐름으로 쉽게 확인할 수 있습니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card sx={{ borderRadius: 5, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" fontWeight={800}>
                    24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    관리 가능
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card sx={{ borderRadius: 5, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" fontWeight={800}>
                    CRUD
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    기능 연습
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: 2,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    실무형 UI 연습
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    단순 기능 구현을 넘어서 실제 관리자 페이지처럼 화면 구조를 익힐 수 있습니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}