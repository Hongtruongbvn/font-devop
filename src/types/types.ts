export interface Game {
  _id: string; // Thêm trường này nếu dùng MongoDB

  id?: string;
  rawg_id: number;
  name: string;
  description: string;
  image_url: string;
  genres: string[];
  platforms: string[];
  rating: number;
  price: number;
}
export type CreateGameInput = Omit<Game, "_id">;
export interface User {
  _id: string;
  name: string;
  email: string;
  coin_balance: number;
  role: string;
}

export interface Purchase {
  id: string;
  game: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
  purchase_at: string;
  price: number;
}

export interface Rental {
  id: string;
  game: {
    id: string;
    name: string;
    image_url: string;
    price: number;
  };
  rent_at: string;
  expire_at: string;
  status: string;
}

export interface AuthResponse {
  token: string;
}

export interface Recharge {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}
