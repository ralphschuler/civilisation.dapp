import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  condition: boolean;
  redirectTo: string;
}

export default function ProtectedRoute({ condition, redirectTo }: ProtectedRouteProps) {
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
