import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clapperboard,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Play,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  loginUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, errorMessage, successMessage, isAuthenticated } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    identifier: "", //identifier for username/email
    password: "",
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      setFormData({ identifier: "", password: "" });
      navigate("/");
    }

    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage, navigate, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);

    const credential = isEmail
      ? { email: formData.identifier, password: formData.password }
      : { userName: formData.identifier, password: formData.password };

    // dispatch(clearError());
    dispatch(clearError());
    dispatch(loginUser(credential));
  };

  return (
    <main className="auth-shell">
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-brand" aria-label="Streamly home">
            <span className="auth-brand-mark">
              <Play size={17} fill="currentColor" />
            </span>
            <span className="auth-brand-name">streamly</span>
          </Link>

          <p className="auth-kicker">Your next watch starts here</p>
          <h1 className="auth-title">Welcome back.</h1>
          <p className="auth-subtitle">
            Sign in to pick up where you left off and find something worth
            sharing.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div>
              <label htmlFor="identifier" className="auth-field-label">
                Username or email
              </label>
              <div className="auth-input-wrap">
                {formData.identifier.includes("@") ? (
                  <Mail
                    className="auth-input-icon"
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <UserRound
                    className="auth-input-icon"
                    size={18}
                    aria-hidden="true"
                  />
                )}
                <input
                  type="text"
                  name="identifier"
                  id="identifier"
                  className="auth-input"
                  placeholder="you@example.com or username"
                  autoComplete="username"
                  autoCapitalize="none"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="auth-field-label">
                Password
              </label>
              <div className="auth-input-wrap">
                <LockKeyhole
                  className="auth-input-icon"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="auth-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-primary-button mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="auth-switch">
            New to Streamly? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>

      <aside
        className="auth-visual"
        aria-label="Streamly film-inspired artwork"
      >
        <div className="auth-visual-content">
          <span className="auth-visual-caption">
            <Clapperboard size={14} /> Stories worth staying for
          </span>
          <h2 className="auth-visual-title">
            Find your
            <br />
            next favorite.
          </h2>
          <p className="auth-visual-copy">
            A world of fresh perspectives, memorable moments, and creators to
            come back to.
          </p>
          <p className="auth-footer-note">Good stories are better together.</p>
        </div>
      </aside>
    </main>
  );
};

export default LoginPage;
