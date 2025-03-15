import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
        <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;