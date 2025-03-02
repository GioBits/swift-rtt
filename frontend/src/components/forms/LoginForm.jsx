import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authActions";
import stt from '../../assets/speech_to_text_pana.svg';
import Swal from "sweetalert2";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [valuesForm, handleInputChange] = useForm({
    email: "",
    password: "",
  });

  const { email, password } = valuesForm;

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

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email, password);

    if (!email || !password) {
      Swal.fire({
        title: "Error",
        text: "Email y contraseña son obligatorios",
        icon: "error",
      });
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Correo electrónico no válido");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      navigate("/media-upload");
      console.log("Respuesta del login:", result);
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
              Entrar
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </form>
        </div>
        <p className="mb-5 m-auto">
          ¿No tienes una cuenta?{' '}
          <Link to='/register' className='text-mintDark font-semibold hover:underline'>
            Regístrate aquí
          </Link>
        </p>
      </div>
      <div className='w-1/2 hidden sm:block bg-slate-400 rounded-r-xl'>
        <img src={stt} alt='Colibri App' className='h-full rounded-r-sm' />
      </div>
    </div>
  );
};
