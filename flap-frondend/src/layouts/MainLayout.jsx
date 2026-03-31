import { AppBar, Avatar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearLoginUser, getLoginUser } from "../utils/authStorage";
import { logout } from "../api/auth";

export default function MainLayout() {
    const navigate = useNavigate();
    const loginUser = getLoginUser();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("로그아웃 API 실패:", err);
        } finally {
            clearLoginUser();
            navigate("/login");
        }
    };

    return (
        <>
            <AppBar position="sticky" elevation={1}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 72 }}>
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/"
                            sx={{
                                color: "#fff",
                                textDecoration: "none",
                                fontWeight: "bold",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Flap 예약 서비스
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {loginUser ? (
                                <>
                                    <Button color="inherit" component={Link} to="/reservations/new">
                                        예약하기
                                    </Button>
                                    <Button color="inherit" component={Link} to="/my-reservations">
                                        내 예약
                                    </Button>
                                    <Button color="inherit" component={Link} to={`/members/${loginUser.id}`}>
                                        내 정보
                                    </Button>
                                    <Button color="inherit" component={Link} to={`/members/${loginUser.id}/edit`}>
                                        내 정보 수정
                                    </Button>

                                    <Avatar sx={{ width: 32, height: 32, fontSize: 14, ml: 1 }}>
                                        {loginUser?.name?.[0] || "U"}
                                    </Avatar>

                                    <Button color="inherit" onClick={handleLogout}>
                                        로그아웃
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button color="inherit" component={Link} to="/login">
                                        로그인
                                    </Button>
                                    <Button color="inherit" component={Link} to="/members/new">
                                        회원가입
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                sx={{
                    minHeight: "calc(100vh - 72px)",
                    bgcolor: "#f5f7fb",
                    px: 2,
                    py: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>
        </>
    );
}