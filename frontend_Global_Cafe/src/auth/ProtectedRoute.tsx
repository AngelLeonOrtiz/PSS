import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

type Props = {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
};

export default function ProtectedRoute({ children, requiredPermission, requiredRole }: Props) {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <>{children}</>;
}
