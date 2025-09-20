import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // States for token, role, and email
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")?.toLowerCase() || null
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email") || null
  );

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (role) localStorage.setItem("role", role.toLowerCase());
    else localStorage.removeItem("role");

    if (email) localStorage.setItem("email", email);
    else localStorage.removeItem("email");
  }, [token, role, email]);

  // Login function
  const login = (newToken: string, newRole: string, newEmail: string) => {
    setToken(newToken);
    setRole(newRole.toLowerCase());
    setEmail(newEmail);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole.toLowerCase());
    localStorage.setItem("email", newEmail);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setRole(null);
    setEmail(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  // Context value
  const contextValue: AuthContextType = {
    token,
    role,
    email,
    setEmail,
    setRole,
    setToken,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;