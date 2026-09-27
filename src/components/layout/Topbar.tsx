import { Link, useLocation } from "react-router-dom";
import { FileText, Wrench, Upload } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/builder", label: "Builder", icon: Wrench },
    { to: "/import", label: "Import JSON", icon: Upload },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity"
        >
          <FileText className="h-5 w-5 text-primary" />
          <span>{APP_NAME}</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}