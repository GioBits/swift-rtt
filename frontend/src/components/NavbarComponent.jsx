import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_colibri.png";
import PingComponent from "./PingComponent";
import userService from "../service/userService";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";

const menuItems = [
  { label: "Traducir", path: "/media-upload" },
  { label: "Historial", path: "/history" },
];

const NavbarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const username = useSelector((state) => state.auth.user.username);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      userService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="h-[60px] bg-blueMetal flex items-center px-6 shadow-md w-full relative justify-center">
      {/* Logo y titulo */}
      <div className="absolute w-full sm:relative sm:w-[30%] h-full sm:border-r border-gray-500 flex items-center px-4 justify-center sm:justify-start">
        <img src={logo} alt="Logo" className="w-[70px] h-[40px]" />
        <span className="text-2xl font-semibold text-white ml-3 hidden sm:block">
          SwiftVoice
        </span>
      </div>

      {/* Menu principal */}
      <div className="w-[70%] flex justify-between items-center px-4">
        <div className="hidden sm:flex space-x-8">
          {menuItems.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`relative text-lg font-semibold text-white px-2 py-1 transition-all hover:text-gray-300 ${
                location.pathname === path
                  ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-white after:rounded-md"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Informacion del usuario y logout */}
        <div className="hidden sm:flex space-x-4 items-center">
          <span className="text-md font-semibold text-white">@{username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white w-[100px] font-semibold h-[36px] rounded-lg text-sm hover:bg-red-600 shadow-md"
          >
            Cerrar sesión
          </button>
          <PingComponent />
        </div>

        {/* Boton de menu movil */}
        <div className="absolute right-6 sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Menu desplegable en movil */}
      <Collapse in={menuOpen} timeout="auto" unmountOnExit>
        <div className="absolute top-[60px] left-0 w-full bg-blueMetal shadow-md sm:hidden">
          {menuItems.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigate(path)}
              className={`block w-full text-center text-white px-4 py-2 hover:bg-gray-500 ${
                location.pathname === path ? "bg-gray-700" : ""
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-center text-white px-4 py-2 hover:bg-gray-500"
          >
            Cerrar sesión
          </button>
        </div>
      </Collapse>
    </nav>
  );
};

export default NavbarComponent;
