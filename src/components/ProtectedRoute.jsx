import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userState = useSelector((state) => state.user);
  const user = userState?.user || userState; // Handle both structures

  console.log("🔐 ProtectedRoute check:", {
    userState,
    user,
    userRole: user?.role,
    allowedRoles,
    hasAccess: user?.role && allowedRoles.includes(user.role),
  });

  if (!user?.role || !allowedRoles.includes(user.role)) {
    console.log(" Access denied, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log(" Access granted");
  return children;
};

export default ProtectedRoute;
