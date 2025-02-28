import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <>
      <NavbarComponent /> {/* Se muestra solo en rutas privadas */}
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;
