import CreateGameModal from "../components/CreateGameModal";
import "../styles/main.css";

const CreateGamePage = () => {
  return (
    <div className="page-container">
      <CreateGameModal isOpen={true} onClose={() => window.history.back()} />
    </div>
  );
};

export default CreateGamePage;
