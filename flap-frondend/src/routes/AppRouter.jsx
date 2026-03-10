import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../layouts/ProtectedRoute";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

import MemberCreatePage from "../pages/member/MemberCreatePage";
import MemberDetailPage from "../pages/member/MemberDetailPage";
import MemberEditPage from "../pages/member/MemberEditPage";
import MemberListPage from "../pages/member/MemberListPage";

import ReservationListPage from "../pages/reservation/ReservationListPage";
import ReservationCreatePage from "../pages/reservation/ReservationCreatePage";
import ReservationDetailPage from "../pages/reservation/ReservationDetailPage";
import ReservationEditPage from "../pages/reservation/ReservationEditPage";
import MyReservationListPage from "../pages/reservation/MyReservationListPage";

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

          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <ReservationListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/new"
            element={
              <ProtectedRoute>
                <ReservationCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id"
            element={
              <ProtectedRoute>
                <ReservationDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id/edit"
            element={
              <ProtectedRoute>
                <ReservationEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute>
                <MyReservationListPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
