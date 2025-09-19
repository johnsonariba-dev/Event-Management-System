import { createContext, useState } from "react";
import type { ReactNode } from "react";

// 1️⃣ Export type
export type AuthContextType = {
  email: string | null;
  role: string | null;
  token: string | null;
  setEmail: (email: string | null) => void;
  setRole: (role: string | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};


// 2️⃣ Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3️⃣ Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.clear();
    setEmail(null);
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ email, role, token, setEmail, setRole, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4️⃣ Custom hook

export { AuthContext };