import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen-safe flex flex-col bg-background">
      <Topbar />
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}