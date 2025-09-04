// src/components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[]; // si no se pasa, basta con estar autenticado
  redirectTo?: string;
}

export default function PrivateRoute({
  children,
  roles,
  redirectTo = "/signin",
}: PrivateRouteProps) {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext.initialized) return null;

  if (!authContext?.user) {
    // no está logueado
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(authContext?.user.role)) {
    // está logueado pero rol no permitido
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
