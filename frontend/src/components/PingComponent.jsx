import { useEffect, useState } from "react";
import axios from "axios";
import Alert from '@mui/material/Alert';

const PingComponent = () => {
  const [serverResponse, setServerResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        // Crear instancia de Axios con tiempo de espera
        const axiosInstance = axios.create({
          baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000", // <- 2da URL API MOCK CON JSON SERVER
          timeout: 5000, // Timeout de 5 segundos
        });

        // Realizar la petición GET al endpoint /ping
        const response = await axiosInstance.get("/ping");

        // Almacenar la respuesta en el estado
        setServerResponse(response.data.message);
        setErrorMessage(null); // Limpiar cualquier mensaje de error previo
      } catch (error) {
        // Manejo de errores de la petición
        if (error.code === "ECONNABORTED") {
          setErrorMessage("La petición tardó demasiado. Inténtalo de nuevo.");
        } else if (error.response) {
          setErrorMessage(
            `Error del servidor: ${error.response.status} - ${error.response.statusText}`
          );
        } else {
          setErrorMessage("Ocurrió un error al intentar conectarse al servidor.");
        }
      }
    };

    // Llamar a la función de fetchPing cuando el componente se monte
    fetchPing();
  }, []); // Dependencia vacía, solo se ejecuta una vez cuando el componente se monta

  return (
    <Alert severity={serverResponse ? "success" : errorMessage ? "error" : "info"} style={{top: "20px", right: "20px", position: "fixed"}}>
      {serverResponse ? `Respuesta del servidor al endpoint ping: ${serverResponse}` : errorMessage ? errorMessage : "Cargando..."}
    </Alert>
  );
};

export default PingComponent;
