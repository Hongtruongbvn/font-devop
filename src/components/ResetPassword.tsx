import { useState } from "react";
import { resetPassword } from "../services/api";
import { toast } from "react-toastify";
import "../styles/main.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.warn("⚠️ New passwords don't match");
      return;
    }

    try {
      await resetPassword(email, currentPassword, newPassword);
      toast.success("✅ Password changed successfully");
    } catch (err) {
      toast.error("❌ Current password is incorrect or system error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Reset Password</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Update Password
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Need help?{" "}
            <a href="/support" className="text-link">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
