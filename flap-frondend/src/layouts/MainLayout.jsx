import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fc" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Flap Front
          </Typography>

          <Button component={RouterLink} to="/" color="inherit">
            홈
          </Button>

          <Button component={RouterLink} to="/login" color="inherit">
            로그인
          </Button>

          <Button component={RouterLink} to="/members" color="inherit">
            회원목록
          </Button>

          <Button component={RouterLink} to="/reservations" color="inherit">
            예약목록
          </Button>

          <Button
            component={RouterLink}
            to="/members/new"
            variant="contained"
            sx={{ ml: 2, borderRadius: 3 }}
          >
            회원가입
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Outlet />
      </Container>
    </Box>
  );
}