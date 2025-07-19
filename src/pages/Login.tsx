import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";
import AuthModal from "../components/AuthModal";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthModal
        isOpen={true}
        onClose={() => navigate("/")}
        type="login"
        onSwitchType={() => navigate("/register")}
        
      />
    </div>
  );
};

export default Login;
