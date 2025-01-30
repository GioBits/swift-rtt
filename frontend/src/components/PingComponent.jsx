import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setSuccess, clearError } from '../store/slices/errorSlice';
import { apiService } from '../service/api';
import { getMessage } from '../utils/localeHelper';

const PingComponent = () => {
  const dispatch = useDispatch();
  const { message, type, origin } = useSelector((state) => state.error);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await apiService.ping();
        dispatch(setSuccess({
          message: getMessage("PingComponent", "server_response", { message: response.message }),
          origin: "PingComponent"
        }));

        setTimeout(() => {
          setVisible(false);
          dispatch(clearError());
        }, 3000);
      } catch (error) {
        dispatch(setError({
          message: getMessage("PingComponent", "error", { error: error.message }),
          origin: "PingComponent"
        }));

        setTimeout(() => {
          setVisible(false);
          dispatch(clearError());
        }, 3000);
      }
    };

    fetchPing();
  }, [dispatch]);

  if (!visible || !message || origin !== "PingComponent") {
    return null;
  }

  return (
    <Alert severity={type} style={{ top: "20px", right: "20px", position: "fixed" }}>
      {message}
    </Alert>
  );
};

export default PingComponent;
