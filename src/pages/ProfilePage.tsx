import ProfileModal from "../components/ProfileModal";
import { getCurrentUser } from "../services/auth";

const ProfilePage = () => {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ProfileModal
        isOpen={true}
        onClose={() => window.history.back()}
        userId={user?.userId || ""}
      />
    </div>
  );
};

export default ProfilePage;
