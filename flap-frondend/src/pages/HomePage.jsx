import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getLoginUser } from "../utils/authStorage";

export default function HomePage() {
  const loginUser = getLoginUser();

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 6 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Flap 예약 서비스
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {loginUser
              ? `${loginUser.name}님, 원하는 구장과 시간을 선택해 예약하세요.`
              : "로그인 후 예약 서비스를 이용할 수 있습니다."}
          </Typography>

          <Stack direction="row" spacing={2}>
            {loginUser ? (
              <>
                <Button variant="contained" component={Link} to="/reservations/new">
                  예약하기
                </Button>
                <Button variant="outlined" component={Link} to="/my-reservations">
                  내 예약 확인
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" component={Link} to="/login">
                  로그인하러 가기
                </Button>
                <Button variant="outlined" component={Link} to="/members/new">
                  회원가입
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}