import {
  ArrowRight,
  Clapperboard,
  Eye,
  EyeOff,
  ImagePlus,
  LockKeyhole,
  Mail,
  Play,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import "./AuthPages.css";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, errorMessage, successMessage } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    fullName: "",
    password: "",
    avatar: null, //reqired
    coverImage: null, //optional
  });

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
      navigate("/login");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [successMessage, errorMessage, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "avatar") {
          setAvatarPreview(reader.result);
        } else if (name === "coverImage") {
          setCoverImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.avatar) {
      toast.error("Please upload your avatar!");
      return;
    }

    dispatch(clearError());
    dispatch(registerUser(formData));
  };

  const renderUpload = (name, label, preview, required) => (
    <label className="auth-upload-label">
      {preview ? (
        <img
          src={preview}
          alt={`${label} preview`}
          className={
            name === "avatar" ? "auth-upload-avatar" : "auth-upload-cover"
          }
        />
      ) : (
        <>
          {name === "avatar" ? (
            <UserRound
              className="text-[var(--accent)]"
              size={25}
              aria-hidden="true"
            />
          ) : (
            <ImagePlus
              className="text-[var(--accent)]"
              size={25}
              aria-hidden="true"
            />
          )}
          <span className="text-xs text-[var(--text-muted)]">
            {name === "avatar"
              ? "Choose a profile photo"
              : "Add a channel cover"}
          </span>
        </>
      )}
      <span className="auth-upload-caption">
        {label}
        {required ? " · Required" : " · Optional"}
      </span>
      <input
        type="file"
        name={name}
        id={name}
        accept="image/*"
        required={required}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );

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

          <p className="auth-kicker">Make yourself at home</p>
          <h1 className="auth-title">Join the story.</h1>
          <p className="auth-subtitle">
            Create your account and build a place for the videos and creators
            you love.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            encType="multipart/form-data"
            className="auth-form auth-register-form"
          >
            <div className="auth-register-fields">
              <div>
                <label htmlFor="userName" className="auth-field-label">
                  Username
                </label>
                <div className="auth-input-wrap">
                  <UserRound
                    className="auth-input-icon"
                    size={17}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Choose a username"
                    autoComplete="username"
                    autoCapitalize="none"
                    required
                    value={formData.userName}
                    onChange={handleChange}
                    name="userName"
                    id="userName"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="fullName" className="auth-field-label">
                  Full name
                </label>
                <div className="auth-input-wrap">
                  <UserRound
                    className="auth-input-icon"
                    size={17}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    name="fullName"
                    id="fullName"
                  />
                </div>
              </div>
              <div className="auth-field-full">
                <label htmlFor="email" className="auth-field-label">
                  Email address
                </label>
                <div className="auth-input-wrap">
                  <Mail
                    className="auth-input-icon"
                    size={17}
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    id="email"
                  />
                </div>
              </div>
              <div className="auth-field-full">
                <label htmlFor="password" className="auth-field-label">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <LockKeyhole
                    className="auth-input-icon"
                    size={17}
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    id="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="auth-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="auth-upload-grid">
              {renderUpload("avatar", "Profile photo", avatarPreview, true)}
              {renderUpload(
                "coverImage",
                "Cover image",
                coverImagePreview,
                false,
              )}
            </div>

            <button
              type="submit"
              className="auth-primary-button mt-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating your account..." : "Create account"}
              {!isLoading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="auth-switch">
            Already part of Streamly? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>

      <aside
        className="auth-visual"
        aria-label="Streamly film-inspired artwork"
      >
        <div className="auth-visual-content">
          <span className="auth-visual-caption">
            <Clapperboard size={14} /> A community for every point of view
          </span>
          <h2 className="auth-visual-title">
            There’s always
            <br />
            more to discover.
          </h2>
          <p className="auth-visual-copy">
            Find your people through the things you watch, make, and share.
          </p>
          <p className="auth-footer-note">
            Your channel. Your taste. Your Streamly.
          </p>
        </div>
      </aside>
    </main>
  );
};

export default RegisterPage;
