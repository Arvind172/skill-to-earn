import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, allowedRole,children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role != allowedRole) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
}

export default ProtectedRoute;
