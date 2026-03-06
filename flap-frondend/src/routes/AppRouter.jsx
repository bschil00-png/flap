import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MemberCreatePage from "../pages/MemberCreatePage";
import MemberDetailPage from "../pages/MemberDetailPage";
import MemberListPage from "../pages/MemberListPage";
import MemberEditPage from "../pages/MemberEditPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/members/new" element={<MemberCreatePage />} />
        <Route path="/members/:id" element={<MemberDetailPage />} />
        <Route path="/members" element={<MemberListPage />} />
        <Route path="/members/:id/edit" element={<MemberEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}