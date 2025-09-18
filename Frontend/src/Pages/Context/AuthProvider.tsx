import { useState } from "react";
import { AuthContext,  } from "./AuthContext";
import type { ReactNode } from "react";
import type { AuthContextType } from "./AuthContext";


type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const value: AuthContextType = {
    email,
    role,
    token,
    setEmail,
    setRole,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
