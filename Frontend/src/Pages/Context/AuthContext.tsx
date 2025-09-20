import { createContext } from "react";

export type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (newToken: string, newRole: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
