import React, { useEffect, useState } from "react";
import { fetchGamesByPage } from "../services/api";
import { toast } from "react-toastify";
import type { Game } from "../types/types";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import CreateGameModal from "../components/CreateGameModal";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const loadGames = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchGamesByPage(page);
      setGames(res.data.games);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error loading games:", err);
      toast.error("❌ Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames(1);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }

    const purchaseSuccess = sessionStorage.getItem("purchaseSuccess");
    if (purchaseSuccess) {
      alert("🎉 Purchase successful!");
      sessionStorage.removeItem("purchaseSuccess");
    }
  }, []);

  return (
    <div className="page-container">
      <Navbar />

      <div className="content-container">
        <div className="header-section">
          <h1 className="page-title">Game Library</h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/create")}
              className="create-button"
            >
              + Create Game
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="games-grid">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <nav className="pagination-nav">
                  <button
                    onClick={() => loadGames(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="pagination-button"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return pageNum;
                  }).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => loadGames(pageNum)}
                      disabled={pageNum === currentPage || loading}
                      className={`pagination-button ${
                        pageNum === currentPage ? "active" : ""
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => loadGames(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateGameModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            loadGames(currentPage);
          }}
        />
      )}
    </div>
  );
};

export default Home;
