import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";
import { useAuth } from "../Pages/Context/UseAuth";


export function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role?: string;
}) {
  const { token, role: userRole } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
export default ProtectedRoute;
