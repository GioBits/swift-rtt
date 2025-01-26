import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { apiService } from '../service/api';

const PingComponent = () => {
  const [serverResponse, setServerResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await apiService.ping();
        setServerResponse(response);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    fetchPing();
  }, []);

  return (
    <Alert severity={serverResponse ? "success" : errorMessage ? "error" : "info"} style={{top: "20px", right: "20px", position: "fixed"}}>
      {serverResponse ? `Respuesta del servidor al endpoint ping: ${serverResponse}` : errorMessage ? errorMessage : "Cargando..."}
    </Alert>
  );
};

export default PingComponent;
