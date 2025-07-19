import axios from "axios";
import type { Game, Purchase, Rental } from "../types/types";

const API_URL = "https://backdevop.nurseryschool.website";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// services/api.ts
export const getGames = (params?: { page?: number; limit?: number }) => {
  return api.get("/games/", {
    params: {
      page: params?.page,
      limit: params?.limit,
    },
  });
};
export const deleteGame = (id: string) => api.delete(`/games/${id}`);
export const createGame = (formData: FormData) =>
  api.post("/games/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const fetchGamesFromRawg = () => api.get("/games/fetch");

export const register = (user: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", user);

export const login = (credentials: { email: string; password: string }) =>
  api.post("/auth/login", credentials);
export const fetchGamesByPage = (page: number) =>
  api.get("/games/fetch-games", {
    params: { page },
  });

export const buyGame = (gameId: string) => api.post(`/buy/${gameId}`);

export const getUser = (id: string) => api.get(`/users/${id}`);

export const rentGame = (gameId: string) => api.post(`/rent/${gameId}`);
export const checkRental = (gameId: string) =>
  api.get(`/rental/check/${gameId}`);

export const getMyPurchases = async (): Promise<Purchase[]> => {
  const res = await api.get("/api/my-purchases", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.data.purchases;
};
export const getMyRentals = async (): Promise<Rental[]> => {
  // Thay Rental bằng Rental[]
  const token = localStorage.getItem("token");

  const response = await api.get("/api/my-rentals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.rentals || []; // Giả sử API trả về { rentals: [...] }
};

export const rechargeCoin = async (amount: number) => {
  return await api.post("/recharge", { amount });
};

export const getRechargeHistory = async () => {
  const res = await api.get("/recharge-history");
  return res.data.recharges;
};
export const promote = async (userId: string) => {
  await api.put(`/users/${userId}/promote`);
};
export const forgotPassword = (email: string) => {
  return api.post("/users/forgot-password", { email });
};

export const resetPassword = (
  email: string,
  currentPassword: string,
  newPassword: string
) => {
  return api.post("/users/reset-password", {
    email,
    current_password: currentPassword,
    new_password: newPassword,
  });
};
export const changePassword = (data: {
  email: string;
  current_password: string;
  new_password: string;
}) => {
  return api.post("/users/change-password", data); // endpoint của bạn
};
export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getAuthToken();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
