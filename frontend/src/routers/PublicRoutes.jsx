import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ParticleBg from "../components/ParticleBg";

const PublicRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return !isAuthenticated ? (
    <>
      <ParticleBg />
      <Outlet />
    </>
  ) : (
    <Navigate to="/media-upload" replace />
  );
};

PublicRoutes.propTypes = {
  children: PropTypes.node,
};

export default PublicRoutes;
