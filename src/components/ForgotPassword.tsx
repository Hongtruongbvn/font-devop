import { useState } from "react";
import { forgotPassword } from "../services/api";
import { toast } from "react-toastify";
import "../styles/main.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("📧 Check your email to reset your password");
    } catch (err) {
      toast.error("❌ Failed to send reset email, please try again");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Forgot Password</h2>

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
              placeholder="Enter your email"
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Send Reset Link
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <a href="/login" className="text-link">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
