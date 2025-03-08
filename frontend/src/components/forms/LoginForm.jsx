import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authActions";
import stt from '../../assets/stt_pana.svg';
import Swal from "sweetalert2";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [valuesForm, handleInputChange] = useForm({
    username: "",
    password: "",
  });

  const { username, password } = valuesForm;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        title: "Error",
        text: "Nombre de usuario y contraseña son obligatorios",
        icon: "error",
      });
      return;
    }

    try {
      await dispatch(loginUser({ username, password }))
      navigate("/media-upload");
    } catch (err) {
      console.error("Error en el login:", err);
    }
  };

  return (
    <div className='w-[800px] flex flex-row shadow-xl z-10'>
      <div className='w-1/2 flex flex-col bg-white rounded-l-xl h-[29rem]'>
        <div className="h-full bg-white p-5 flex flex-col items-center justify-center rounded-l-xl m-auto">
          <h3 className="titleForm">Iniciar sesión</h3>
          <form onSubmit={handleLogin}>
            <input
              autoComplete="off"
              className="inputForm"
              name="username"
              onChange={handleInputChange}
              placeholder="Nombre de usuario"
              type="text"
              value={username}
            />
            <input
              autoComplete="off"
              className="inputForm"
              name="password"
              onChange={handleInputChange}
              placeholder="Contraseña"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
            />
            <label className="flex mb-5">
              <input
                type="checkbox"
                className="mr-2 accent-blueMetal"
                checked={isPasswordVisible}
                onChange={togglePasswordVisibility}
              />
              <span className="text-xs text-gray-600">
                {!isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña"}
              </span>
            </label>

            <button type="submit" className="buttonForm">
              Entrar
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
        <p className="mb-5 m-auto">
          ¿No tienes una cuenta?{' '}
          <Link to='/register' className='text-mintDark font-semibold hover:underline'>
            Regístrate aquí
          </Link>
        </p>
      </div>
      <div className='w-1/2 hidden sm:block bg-blueMetal rounded-r-xl'>
        <img src={stt} alt='Colibri App' className='h-full rounded-r-sm' />
      </div>
    </div>
  );
};