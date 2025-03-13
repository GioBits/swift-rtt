import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_colibri.png";
import PingComponent from "./PingComponent";

function NavbarComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const username = useSelector(state => state.auth.user.username);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="h-[60px] bg-[#011638] flex items-center px-6 shadow-md">
      {/* Logo y título */}
      <div className="w-[30%] h-full border-r border-gray-500 flex items-center px-4">
        <img src={logo} alt="Logo" className="w-[70px] h-[40px]" />
        <span className="text-2xl font-semibold text-white ml-3">
          SwiftVoice
        </span>
      </div>

      <div className="w-[70%] h-full flex justify-between items-center px-4">
        <div className="flex space-x-8 w-1/2">
          <button
            onClick={() => navigate("/media-upload")}
            className={`relative text-lg font-semibold text-white px-2 py-1 transition-all 
              hover:text-gray-300 ${
                location.pathname === "/media-upload"
                  ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-white after:rounded-md"
                  : ""
              }`}
          >
            Traducir
          </button>

          <button
            onClick={() => navigate("/history")}
            className={`relative text-lg font-semibold text-white px-2 py-1 transition-all 
              hover:text-gray-300 ${
                location.pathname === "/history"
                  ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-white after:rounded-md"
                  : ""
              }`}
          >
            Historial
          </button>
        </div>

        <div className="w-1/2 flex">
          <div className="flex space-x-4 m-auto mr-[0px]">

            <div className="text-md font-semibold text-white flex">
              <span className="m-auto"> {username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white w-[100px] font-semibold h-[36px] rounded-lg text-sm hover:bg-red-600 shadow-md"
            >
              Cerrar sesión
            </button>

            <PingComponent />
          </div>

        </div>
      </div>
    </div>
  );
}

export default NavbarComponent;
