import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMember, deleteMember } from "../api/members";
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
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setError("");
      try {
        const res = await getMember(id);
        setMember(res.data);
      } catch (err) {
        const msg = err?.response?.data?.message || "조회 실패";
        setError(msg);
      }
    };
    run();
  }, [id]);

  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMember(id);
      alert("회원 삭제 성공");
      navigate("/members");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "회원 삭제 실패");
    }
  };



  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          회원 상세
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

            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={() => navigate("/members")}
            >
              목록으로
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 3, mr: 2 }}
              onClick={() => navigate(`/members/${member.id}/edit`)}
            >
              수정하기
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{ mt: 3 }}
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