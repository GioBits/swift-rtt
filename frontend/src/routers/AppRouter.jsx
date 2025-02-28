import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Home from "../views/Home";
import Login from "../views/Login";
import History from "../views/History";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/media-upload" element={<Home />} />
          <Route path="/history" element={<History />} />

          <Route path="*" element={<Navigate to="/media-upload" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
