import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Moon, Sun, User, X } from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";
import SearchBar from "./SearchBar";
import { logoutUser, clearAuth } from "../../redux/slices/authSlice";
import NotificationBell from "../Notifications/NotificationBell";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    // prevent default if called from a link
    if (e && e.preventDefault) e.preventDefault();
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      dispatch(clearAuth());
    } finally {
      // redirect to login page after logout
      navigate("/login");
    }
  };

  return (
    <header>
      <nav className="fixed inset-x-0 top-0 z-50 flex h-24 flex-wrap content-center justify-between gap-y-1 border-b border-border bg-surface text-text-primary shadow-soft sm:h-14 sm:flex-nowrap sm:gap-y-0 md:h-16">
        <div className="flex basis-[calc(50%-0.5rem)] shrink-0 items-center px-2 sm:w-32 sm:basis-auto sm:px-6 md:w-[30%]">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 transition-colors hover:bg-surface-raised sm:mr-2 sm:p-2 md:mx-4"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? (
              <X className={`h-7 w-7`} />
            ) : (
              <Menu className={`h-7 w-7`} />
            )}
          </button>

          <div className="h-9 w-14 object-contain sm:w-20">
            <img src="/src/assets/images/logo.png" alt="Streamly" />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />

        <div className="flex basis-[calc(50%-0.5rem)] shrink-0 items-center justify-end gap-0 px-1 sm:basis-auto sm:gap-4 sm:px-2 md:px-6">
          {!isAuthenticated ? (
            <NavLink
              to="/login"
              className="text-xs font-semibold leading-none text-accent sm:text-sm"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="text-xs font-semibold leading-none text-accent sm:text-sm"
            >
              Logout
            </button>
          )}

          <button
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            className="rounded-full p-1.5 transition-colors hover:bg-surface-raised sm:p-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <NotificationBell />
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="rounded-full p-1.5 transition-colors hover:bg-surface-raised sm:p-2"
            aria-label="Account settings"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
