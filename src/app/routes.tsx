import { Routes, Route } from "react-router-dom";

import { Landing } from "./screens/Landing";
import { Onboarding } from "./screens/Onboarding";

import { Dashboard } from "./screens/Dashboard";
import { AdminDashboard } from "./screens/AdminDashboard";

import { CBCAnalysis } from "./screens/CBCAnalysis";
import { ScanScreen } from "./screens/ScanScreen";

import { DietPlanner } from "./screens/DietPlanner";
import { DoctorConsult } from "./screens/DoctorConsult";

import { HealthTracking } from "./screens/HealthTracking";
import { SymptomsTracker } from "./screens/SymptomsTracker";
import { Reminders } from "./screens/Reminders";

import { Awareness } from "./screens/Awareness";
import { Login } from "./screens/Login";
import { AssessmentChoice } from "./screens/AssessmentChoice";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { PasswordReset } from "./screens/PasswordReset";
import { RequireAuth } from "./auth/RequireAuth";
import { GoogleCallback } from "./screens/GoogleCallback";
import { GlobalControls } from "./components/GlobalControls";

export default function AppRoutes() {
  return (
    <>
      <GlobalControls />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/cbc-analysis"
          element={
            <RequireAuth>
              <CBCAnalysis />
            </RequireAuth>
          }
        />
        <Route
          path="/scan"
          element={
            <RequireAuth>
              <ScanScreen />
            </RequireAuth>
          }
        />

        <Route
          path="/diet"
          element={
            <RequireAuth>
              <DietPlanner />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor"
          element={
            <RequireAuth>
              <DoctorConsult />
            </RequireAuth>
          }
        />

        <Route
          path="/tracking"
          element={
            <RequireAuth>
              <HealthTracking />
            </RequireAuth>
          }
        />
        <Route
          path="/symptoms"
          element={
            <RequireAuth>
              <SymptomsTracker />
            </RequireAuth>
          }
        />
        <Route
          path="/reminders"
          element={
            <RequireAuth>
              <Reminders />
            </RequireAuth>
          }
        />

        <Route path="/awareness" element={<Awareness />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assessment" element={<AssessmentChoice />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}
