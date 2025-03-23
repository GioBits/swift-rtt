import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { MediaProvider } from "../contexts/MediaProvider";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <MediaProvider>
      <Outlet />
    </MediaProvider>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;