import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { MediaProvider } from "../contexts/MediaProvider";
import NavbarComponent from "../components/NavbarComponent";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <MediaProvider>
      <div className="w-screen h-screen">
        <div className="flex flex-col w-full h-full">
          <NavbarComponent />
          <div className="w-full h-full flex">
            <div className="flex m-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </MediaProvider>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;