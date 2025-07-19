import { useState } from "react";
import { login, register } from "../services/api";
import { setAuthToken } from "../services/auth";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import "../styles/main.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
  onSwitchType: () => void;
}

const AuthModal = ({ isOpen, onClose, type, onSwitchType }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      if (type === "login") {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success("🎉 Login successful!");
      } else {
        response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("🎉 Registration successful! Please login.");
        onSwitchType();
      }

      if (type === "login") {
        setAuthToken(response.data.token);
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Authentication failed. Please try again.";
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          &times;
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            {type === "login" ? (
              <>
                <FaSignInAlt className="inline-icon" /> Login
              </>
            ) : (
              <>
                <FaUserPlus className="inline-icon" /> Register
              </>
            )}
          </h2>
          <p className="text-muted text-center">
            {type === "login"
              ? "Sign in to your account"
              : "Create a new account"}
          </p>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {type === "register" && (
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="inline-icon" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <FaEnvelope className="inline-icon" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="inline-icon" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-block ${
                type === "login" ? "btn-primary" : "btn-secondary"
              }`}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : type === "login" ? (
                <>
                  <FaSignInAlt /> Login
                </>
              ) : (
                <>
                  <FaUserPlus /> Register
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={onSwitchType}
              className="text-primary hover:underline"
            >
              {type === "login"
                ? "Don't have an account? Register here"
                : "Already have an account? Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
