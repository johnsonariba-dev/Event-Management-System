import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";
import { useAuth } from "../Pages/Context/UseAuth";

type ProtectedRouteProps = {
  children: JSX.Element;
  roles?: string[]; // allowed roles, e.g., ["organizer", "admin"]
};

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { token, role } = useAuth();

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction → redirect to unauthorized
  if (
    roles &&
    (!role || !roles.map((r) => r.toLowerCase()).includes(role.toLowerCase()))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render children
  return children;
};
