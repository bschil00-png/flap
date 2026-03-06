import { useEffect, useState } from "react";
import { getMembers } from "../api/members";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
} from "@mui/material";

export default function MemberListPage() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("회원 목록 조회 실패");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        회원 목록
      </Typography>

      {members.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            아직 등록된 회원이 없습니다.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/members/new")}
          >
            회원가입 하러 가기
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <Typography variant="h6">{member.name}</Typography>
                <Typography color="text.secondary">{member.email}</Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  상세 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}