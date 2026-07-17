import type { ReactElement } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../lib/supabaseClient";

export const AppLayout = (): ReactElement => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
          <Link to="/" className="text-lg font-semibold">
            Huella
          </Link>

          <div className="ml-auto flex items-center gap-6 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white">
              Map
            </Link>

            {session ? (
              <>
                <Link to="/reports/mine" className="text-gray-300 hover:text-white">
                  My Reports
                </Link>
                <Link to="/reports/new" className="text-gray-300 hover:text-white">
                  New Report
                </Link>
                <Link to="/settings" className="text-gray-300 hover:text-white">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};