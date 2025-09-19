import { createContext } from "react";

export type AuthContextType = {
  email: string | null;
  role: string | null;
  token: string | null;
  setEmail: (email: string | null) => void;
  setRole: (role: string | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
