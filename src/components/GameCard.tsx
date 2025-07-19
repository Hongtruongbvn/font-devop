import { FaTrash, FaShoppingCart, FaClock } from "react-icons/fa";
import { isAdmin } from "../services/auth";
import { deleteGame, buyGame, rentGame, checkRental } from "../services/api";
import { useState, useEffect } from "react";
import type { Game } from "../types/types";
import "../styles/main.css";

interface GameCardProps {
  game: Game;
  onDelete?: (id: string) => void;
}

const GameCard = ({ game, onDelete }: GameCardProps) => {
  const [isRented, setIsRented] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkRentalStatus = async () => {
      try {
        const response = await checkRental(game.id || "");
        setIsRented(response.data.active);
      } catch (error) {
        console.error("Error checking rental status:", error);
      }
    };
    checkRentalStatus();
  }, [game.id]);

  const handleBuy = async () => {
    setIsLoading(true);
    try {
      await buyGame(game.id || "");
      alert("🎮 Game purchased successfully!");
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || "Failed to purchase game"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRent = async () => {
    setIsLoading(true);
    try {
      await rentGame(game.id || "");
      setIsRented(true);
      alert("⏳ Game rented for 3 days!");
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || "Failed to rent game"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await deleteGame(game.id || "");
        onDelete?.(game.id || "");
        alert("🗑️ Game deleted successfully");
      } catch (error: any) {
        alert(`❌ ${error.response?.data?.message || "Failed to delete game"}`);
      }
    }
  };

  const rentPrice = Math.floor(game.price / 10);

  return (
    <div className="card">
      <div className="card-img-container">
        <img
          src={
            game.image_url ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={game.name}
          className="card-img"
        />
      </div>

      <div className="card-body">
        <h3 className="card-title">{game.name}</h3>

        {game.genres && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.genres.map((genre, i) => (
              <span key={i} className="badge badge-secondary">
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-yellow-600 font-medium">
            ★ {game.rating.toFixed(1)}
          </span>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{game.price} Coins</p>
            <p className="text-sm text-muted">
              Rent: {rentPrice} Coins / 3 days
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBuy}
            disabled={isLoading}
            className="btn btn-primary btn-sm flex-1"
          >
            <FaShoppingCart /> Buy
          </button>

          {!isRented ? (
            <button
              onClick={handleRent}
              disabled={isLoading}
              className="btn btn-secondary btn-sm flex-1"
            >
              <FaClock /> Rent
            </button>
          ) : (
            <button
              disabled
              className="btn btn-outline btn-sm flex-1 cursor-not-allowed"
            >
              Rented
            </button>
          )}
        </div>

        {isAdmin() && (
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-sm w-full mt-3"
          >
            <FaTrash /> Delete Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCard;
