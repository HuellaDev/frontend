import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { MapPage } from "../pages/map/MapPage";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { CreateReport } from "../pages/reports/CreateReport";
import { ReportDetail } from "../pages/reports/ReportDetail";
import { MyReports } from "../pages/reports/MyReports";
import { Settings } from "../pages/profile/Settings";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <MapPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "reports/:id", element: <ReportDetail /> },
      {
        path: "reports/new",
        element: (
          <ProtectedRoute>
            <CreateReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports/mine",
        element: (
          <ProtectedRoute>
            <MyReports />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);