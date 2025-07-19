import { jwtDecode } from "jwt-decode";

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = (): {
  userId: string;
  email: string;
  role: string;
} | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return {
      userId: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
