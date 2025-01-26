import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { apiService } from '../service/api';

const PingComponent = () => {
  const [serverResponse, setServerResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await apiService.ping();
        setServerResponse(response);
        setErrorMessage(null);

        // Configurar el temporizador para ocultar el componente 3 segundos después de recibir una respuesta
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchPing();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Alert severity={serverResponse ? "success" : errorMessage ? "error" : "info"} style={{ top: "20px", right: "20px", position: "fixed" }}>
      {serverResponse ? `Respuesta del servidor al endpoint ping: ${serverResponse}` : errorMessage ? errorMessage : "Cargando..."}
    </Alert>
  );
};

export default PingComponent;