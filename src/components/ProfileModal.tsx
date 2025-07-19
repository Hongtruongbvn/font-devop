import { useState, useEffect } from "react";
import {
  getUser,
  getMyPurchases,
  getMyRentals,
  getRechargeHistory,
  rechargeCoin,
} from "../services/api";
import { toast } from "react-toastify";
import type { Purchase, Rental, User } from "../types/types";
import type { Recharge } from "../types/types";
import "../styles/main.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProfileModal = ({ isOpen, onClose, userId }: ProfileModalProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState(100);
  const [activeTab, setActiveTab] = useState<
    "purchases" | "rentals" | "recharges"
  >("purchases");
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          userResponse,
          purchasesResponse,
          rentalsResponse,
          rechargesResponse,
        ] = await Promise.all([
          getUser(userId),
          getMyPurchases(),
          getMyRentals(),
          getRechargeHistory(),
        ]);

        setUser(userResponse.data);
        setPurchases(purchasesResponse || []);
        setRentals(rentalsResponse || []);
        setRecharges(rechargesResponse || []);
      } catch (error) {
        toast.error("❌ Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userId]);

  const handleRecharge = async () => {
    if (rechargeAmount < 100) {
      toast.warn("⚠️ Minimum recharge amount is 100");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("🔗 Redirecting to payment gateway...");
      const res = await rechargeCoin(rechargeAmount);
      alert("✅ Recharge successful!");
    } catch (error: any) {
      toast.error(
        `❌ ${error.response?.data?.message || "Failed to initiate recharge"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content wide-modal">
        <button onClick={onClose} className="modal-close">
          &times;
        </button>

        <h2 className="modal-title">User Profile</h2>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {user && (
              <div className="profile-header">
                <div>
                  <h3 className="profile-username">{user.name}</h3>
                  <p className="profile-email">{user.email}</p>
                </div>
                <div className="profile-balance">
                  <p className="balance-label">Coin Balance</p>
                  <p className="balance-amount">
                    {user.coin_balance} <span className="coin-icon">🪙</span>
                  </p>
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button
                onClick={() => (window.location.href = "/forgot-password")}
                className="btn btn-warning"
              >
                Forgot Password
              </button>
              <button
                onClick={() => (window.location.href = "/reset-password")}
                className="btn btn-danger"
              >
                Reset Password
              </button>
            </div>

            <div className="recharge-section">
              <h3 className="section-title">Recharge Coins</h3>
              <div className="recharge-form">
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    placeholder="Enter amount (min 100)"
                    type="number"
                    min="100"
                    step="100"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(Number(e.target.value))}
                    className="form-control"
                  />
                </div>
                <button
                  onClick={handleRecharge}
                  disabled={isLoading}
                  className="btn btn-primary recharge-button"
                >
                  {isLoading ? "Processing..." : "Recharge Now"}
                </button>
              </div>
            </div>

            <div className="tabs">
              <button
                onClick={() => setActiveTab("purchases")}
                className={`tab ${activeTab === "purchases" ? "active" : ""}`}
              >
                Purchase History
              </button>
              <button
                onClick={() => setActiveTab("rentals")}
                className={`tab ${activeTab === "rentals" ? "active" : ""}`}
              >
                Rental History
              </button>
              <button
                onClick={() => setActiveTab("recharges")}
                className={`tab ${activeTab === "recharges" ? "active" : ""}`}
              >
                Recharge History
              </button>
            </div>

            <div className="table-responsive">
              {activeTab === "purchases" ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          You haven't purchased any games yet.
                        </td>
                      </tr>
                    ) : (
                      purchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>{purchase.game.name}</td>
                          <td className="text-success font-bold">
                            ${purchase.price.toFixed(2)}
                          </td>
                          <td className="text-muted">
                            {new Date(purchase.purchase_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : activeTab === "rentals" ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Rent Date</th>
                      <th>Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          No games rented yet.
                        </td>
                      </tr>
                    ) : (
                      rentals.map((rental) => (
                        <tr key={rental.id}>
                          <td>{rental.game.name}</td>
                          <td className="text-muted">
                            {new Date(rental.rent_at).toLocaleDateString()}
                          </td>
                          <td className="text-muted">
                            {new Date(rental.expire_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recharges.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No recharge history yet.
                        </td>
                      </tr>
                    ) : (
                      recharges.map((recharge) => (
                        <tr key={recharge.id}>
                          <td className="text-success font-bold">
                            {recharge.amount} 🪙
                          </td>
                          <td>{recharge.status}</td>
                          <td className="text-muted">
                            {new Date(recharge.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
