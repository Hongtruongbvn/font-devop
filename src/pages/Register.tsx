import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";
import AuthModal from "../components/AuthModal";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthModal
        isOpen={true}
        onClose={() => {}}
        type="register"
        onSwitchType={() => {
          navigate("/login");
        }}
      />
    </div>
  );
};

export default Register;
