import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import registerImg from '../../assets/sign_up_pana.svg';
import userService from "../../service/userService";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [valuesForm, handleInputChange] = useForm({
    name: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { name, lastname, username, password, confirmPassword } = valuesForm;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateUsername = (username) => {
    if (username.length < 3) {
      setUsernameError("El nombre de usuario debe tener al menos 3 caracteres.");
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validatePassword = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError("La contraseña debe tener entre 8 y 12 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial !@#$%^&*.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !lastname || !username || !password || !confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
      });
      return;
    }

    if (!validateUsername(username)) {
      return;
    }

    if (!validatePassword(password, confirmPassword)) {
      return;
    }

    try {
      const result = await userService.registerUser({ name, lastname, username, password });
      if (result) {
        navigate("/login");
      }
      console.log("Usuario registrado:", result);
    } catch (err) {
      console.error("Error en el registro:", err);
    }
  };

  return (
    <div className='w-[800px] flex flex-row shadow-xl z-10'>
      <div className='w-1/2 flex flex-col bg-white rounded-l-xl h-[29rem]'>
        <div className="h-full bg-white p-5 flex flex-col items-center justify-center rounded-l-xl m-auto">
          <h3 className="titleForm">Registro</h3>
          <form onSubmit={handleRegister}>
            <div className="flex w-full gap-4">
              <input
                autoComplete="off"
                className="inputForm !w-1/2"
                name="name"
                onChange={handleInputChange}
                placeholder="Nombre"
                type="text"
                value={name}
              />
              <input
                autoComplete="off"
                className="inputForm !w-1/2"
                name="lastname"
                onChange={handleInputChange}
                placeholder="Apellido"
                type="text"
                value={lastname}
              />
            </div>
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
            <input
              autoComplete="off"
              className="inputForm"
              name="confirmPassword"
              onChange={handleInputChange}
              placeholder="Confirmar contraseña"
              type={isPasswordVisible ? "text" : "password"}
              value={confirmPassword}
            />
            <label className="flex mb-5">
              <input
                type="checkbox"
                className="mr-2 focus:bg-blueMetal"
                checked={isPasswordVisible}
                onChange={togglePasswordVisibility}
              />
              <span className="text-xs text-gray-600">
                {!isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña"}
              </span>
            </label>

            <button type="submit" className="buttonForm">
              Registrarse
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </form>
        </div>
        <p className="mb-5 m-auto">
          ¿Ya tienes una cuenta?{' '}
          <Link to='/login' className='text-mintDark font-semibold hover:underline'>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
      <div className='w-1/2 hidden sm:block bg-slate-400 rounded-r-xl'>
        <img src={registerImg} alt='Colibri App' className='w-full rounded-r-sm' />
      </div>
    </div>
  );
};