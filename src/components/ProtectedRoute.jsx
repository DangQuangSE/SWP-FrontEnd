// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = useSelector((state) => state.user);

  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
