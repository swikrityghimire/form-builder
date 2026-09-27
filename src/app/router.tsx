import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/features/landing/LandingPage";
import { BuilderPage } from "@/features/builder/BuilderPage";
import { ImportPage } from "@/features/importer/ImportPage";
import { AnalyticsPage } from "@/features/analytics/AnaltyticsPage";
import { PublicFormPage } from "@/features/public/PublicFormPage";

export const router = createBrowserRouter([
  // Public form (no AppShell)
  {
    path: "/f",
    element: <PublicFormPage />,
  },

  // Landing (own navbar)
  {
    path: "/",
    element: <LandingPage />,
  },

  // App (with Topbar)
  {
    path: "/",
    element: <AppShell />,
    children: [
      { path: "builder", element: <BuilderPage /> },
      { path: "import", element: <ImportPage /> },
      { path: "analytics/:formId", element: <AnalyticsPage /> },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);