import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMembers } from "../api/members";

export default function MemberListPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        console.log("회원목록 응답:", res.data);

        // 백엔드가 리스트를 바로 반환하는 경우
        if (Array.isArray(res.data)) {
          setMembers(res.data);
          return;
        }

        // 백엔드가 ApiResponse로 감싸서 반환하는 경우
        if (Array.isArray(res.data.data)) {
          setMembers(res.data.data);
          return;
        }

        setMembers([]);
      } catch (err) {
        console.error("회원 목록 조회 실패:", err);
        alert("회원 목록 조회 실패");
      }
    };

    fetchMembers();
  }, []);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            회원 목록
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            등록된 회원 정보를 확인하고 상세 페이지로 이동할 수 있습니다.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/members/new"
          variant="contained"
          sx={{ borderRadius: 3 }}
        >
          새 회원 등록
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="이름 또는 이메일로 검색"
          size="medium"
          sx={{
            bgcolor: "white",
            borderRadius: 3,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
                height: "100%",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {member.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {member.email}
                </Typography>

                <Button
                  component={RouterLink}
                  to={`/members/${member.id}`}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                >
                  상세 보기
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}