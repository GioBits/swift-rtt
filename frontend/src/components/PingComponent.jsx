import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setSuccess, clearError } from '../store/slices/errorSlice';
import { apiService } from '../service/api';

const PingComponent = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.error); // Obtén el mensaje y tipo del estado global
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await apiService.ping();
        dispatch(setSuccess({ message: `Respuesta del servidor al endpoint ping: ${response.message}` }));

        // Configurar el temporizador para ocultar la alerta 3 segundos después
        setTimeout(() => {
          setVisible(false);
          dispatch(clearError()); // Limpia el mensaje global
        }, 3000);
      } catch (error) {
        dispatch(setError({ message: error }));
        setTimeout(() => {
          setVisible(false);
          dispatch(clearError()); // Limpia el mensaje global tras 3 segundos
        }, 3000);
      }
    };

    fetchPing();
  }, [dispatch]);

  if (!visible || !message) {
    return null;
  }

  return (
    <Alert severity={type} style={{ top: "20px", right: "20px", position: "fixed" }}>
      {message}
    </Alert>
  );
};

export default PingComponent;
