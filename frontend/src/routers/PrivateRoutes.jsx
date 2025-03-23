import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarComponent from "../components/NavbarComponent";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
        <div className="w-screen h-screen">
          <div className="flex flex-col w-full h-full">
            <NavbarComponent />
            <Outlet />
          </div>
        </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;