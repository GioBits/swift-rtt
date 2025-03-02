import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authActions";
import Swal from "sweetalert2";
import registerImg from '../../assets/sign_up_pana.svg';
import userService from "../../service/userService";

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [valuesForm, handleInputChange] = useForm({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, lastname, email, password, confirmPassword } = valuesForm;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    handleInputChange(e);
    const email = e.target.value;
    if (!validateEmail(email) && email.length > 0) {
      setEmailError("Correo electrónico no válido");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Intentando registrarse con:", name, lastname, email, password);

    if (!name || !lastname || !email || !password || !confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
      });
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Correo electrónico no válido");
      return;
    }

    if (!validatePassword(password, confirmPassword)) {
      return;
    }

    try {
      const result = await dispatch(
        userService.registerUser({ name, lastname, email, password })
      ).unwrap();
      navigate("/media-upload");
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
              name="email"
              onChange={handleEmailChange}
              placeholder="Email"
              type="email"
              value={email}
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
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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