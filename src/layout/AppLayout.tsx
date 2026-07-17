import type { ReactElement } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AppLayout = (): ReactElement => {
  const { session } = useAuth();

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Map</Link>
          {session ? (
            <>
              <Link to="/reports/mine">My Reports</Link>
              <Link to="/reports/new">New Report</Link>
              <Link to="/settings">Settings</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};