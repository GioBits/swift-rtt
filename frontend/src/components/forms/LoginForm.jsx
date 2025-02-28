import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import Swal from "sweetalert2";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [valuesForm, handleInputChange] = useForm({
    user: "",
    password: "",
  });

  const { user, password } = valuesForm;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", user, password);
  
    if (!user || !password) {
      Swal.fire({
        title: "Error",
        text: "Usuario y contraseña son obligatorios",
        icon: "error",
      });
      return;
    }
  
    try {
      const result = await dispatch(loginUser({ user, password })).unwrap();
      navigate("/media-upload")
      console.log("Respuesta del login:", result); // <-- Esto te dirá si el login es exitoso
    } catch (err) {
      console.error("Error en el login:", err);
    }
    
  };
  

  return (
    <div className="w-72 bg-white p-5 flex flex-col items-center justify-center sm:rounded-l-sm">
      <h3 className="titleForm">Iniciar sesión</h3>
      <form onSubmit={handleLogin}>
        <input
          autoComplete="off"
          className="inputForm"
          name="user"
          onChange={handleInputChange}
          placeholder="Usuario"
          type="text"
          value={user}
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
            className="mr-2 focus:bg-indigo-700"
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
  );
};
