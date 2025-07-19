import { useState } from "react";
import {
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaPlus,
  FaSignOutAlt,
  FaGamepad,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, isAdmin, removeAuthToken } from "../services/auth";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";
import CreateGameModal from "./CreateGameModal";
import { toast } from "react-toastify";
import "../styles/main.css";

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const user = getCurrentUser();

  const handleLogout = () => {
    removeAuthToken();
    toast.success("👋 Logged out successfully!");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="flex items-center">
          <FaGamepad className="nav-brand-icon" />
          <span className="nav-brand">GameStore</span>
        </div>

        <div className="nav-actions">
          {user && isAdmin() && (
            <button
              onClick={() => navigate("/create")}
              className="nav-button secondary"
            >
              <FaPlus /> <span className="hidden md:inline">Create Game</span>
            </button>
          )}

          {user ? (
            <div className="user-dropdown">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary"
              >
                <div className="user-avatar">
                  <FaUser className="text-white" />
                </div>
                <span className="hidden md:inline">
                  {user.role || user.email}
                </span>
              </button>

              {showUserDropdown && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      {isAdmin() ? "Admin" : "User"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate("/profile");
                    }}
                    className="user-menu-item"
                  >
                    <FaUser /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="user-menu-item danger"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="nav-button primary"
              >
                <FaSignInAlt /> <span className="hidden md:inline">Login</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="nav-button secondary"
              >
                <FaUserPlus />{" "}
                <span className="hidden md:inline">Register</span>
              </button>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        onSwitchType={() =>
          setAuthType(authType === "login" ? "register" : "login")
        }
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={user?.userId || ""}
      />

      <CreateGameModal
        isOpen={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
      />
    </nav>
  );
};

export default Navbar;
