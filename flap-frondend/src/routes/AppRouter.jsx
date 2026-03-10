import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import MemberCreatePage from "../pages/MemberCreatePage";
import MemberDetailPage from "../pages/MemberDetailPage";
import MemberListPage from "../pages/MemberListPage";
import MemberEditPage from "../pages/MemberEditPage";
import ReservationListPage from "../pages/ReservationListPage";
import ReservationCreatePage from "../pages/ReservationCreatePage";
import ReservationDetailPage from "../pages/ReservationDetailPage";
import ReservationEditPage from "../pages/ReservationEditPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/members" element={<MemberListPage />} />
          <Route path="/members/new" element={<MemberCreatePage />} />
          <Route path="/members/:id" element={<MemberDetailPage />} />
          <Route path="/members/:id/edit" element={<MemberEditPage />} />

          <Route path="/reservations" element={<ReservationListPage />} />
          <Route path="/reservations/new" element={<ReservationCreatePage />} />
          <Route path="/reservations/:id" element={<ReservationDetailPage />} />
          <Route path="/reservations/:id/edit" element={<ReservationEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}