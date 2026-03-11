import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getMember, deleteMember } from "../../api/members";
import { unwrapData } from "../../api/client";
import { getLoginUser, clearLoginUser } from "../../utils/authStorage";
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

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = getLoginUser();

  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loginUser) return;
    if (String(loginUser.id) !== String(id)) return;

    const run = async () => {
      setError("");
      try {
        const res = await getMember(id);
        const data = unwrapData(res);
        setMember(data);
      } catch (err) {
        const msg = err?.response?.data?.message || "조회 실패";
        setError(msg);
      }
    };

    run();
  }, [id, loginUser]);

  if (!loginUser) {
    return <Navigate to="/login" replace />;
  }

  if (String(loginUser.id) !== String(id)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          내 정보
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && !member && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {member && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>ID:</strong> {member.id}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              <strong>이메일:</strong> {member.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              <strong>이름:</strong> {member.name}
            </Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => navigate(`/members/${id}/edit`)}
              >
                수정하기
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  const ok = window.confirm("정말 탈퇴하시겠습니까?");
                  if (!ok) return;

                  try {
                    await deleteMember(id);
                    clearLoginUser();
                    alert("회원 삭제 성공");
                    navigate("/login");
                  } catch (err) {
                    console.error(err);
                    setError(err?.response?.data?.message || "회원 삭제 실패");
                  }
                }}
              >
                회원 탈퇴
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}