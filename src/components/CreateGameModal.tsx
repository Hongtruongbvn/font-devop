import { useState } from "react";
import "../styles/main.css";
import { createGame } from "../services/api"; // ✅ Thêm dòng này

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchGames?: () => void; // ✅ Nếu muốn gọi lại danh sách game sau khi tạo
}

const CreateGameModal = ({
  isOpen,
  onClose,
  refetchGames,
}: CreateGameModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genres: "",
    platforms: "",
    rating: 0,
    price: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" || name === "price" ? Number(value) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("genres", formData.genres);
      form.append("platforms", formData.platforms);
      form.append("rating", formData.rating.toString());
      form.append("price", formData.price.toString());
      form.append("rawg_id", Math.floor(Math.random() * 10000).toString());

      if (file) {
        form.append("image", file);
      }

      await createGame(form); // ✅ Dùng axios API call

      alert("Game created successfully!");
      onClose();

      if (refetchGames) refetchGames(); // ✅ Nếu có truyền hàm refetch
      else window.location.reload(); // hoặc reload toàn trang
    } catch (error) {
      alert("Failed to create game");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content wide-modal">
        <button onClick={onClose} className="modal-close">
          ×
        </button>

        <h2 className="modal-title">Create New Game</h2>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Genres (comma separated)</label>
            <input
              id="genres"
              name="genres"
              type="text"
              placeholder="Action, Adventure"
              value={formData.genres}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Platforms (comma separated)</label>
            <input
              id="platforms"
              name="platforms"
              type="text"
              placeholder="PC, PlayStation"
              value={formData.platforms}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Rating (0–5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? "Creating..." : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGameModal;
