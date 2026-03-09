import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f7f9fc",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: `"Pretendard", "Noto Sans KR", "Roboto", sans-serif`,
    h2: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
    },
  },
});

export default theme;