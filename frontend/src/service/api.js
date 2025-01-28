import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setError } from './redux/errorSlice';  // Importamos la acción de error


// Instancia de Axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,  // Tiempo de espera de 10 segundos
});


// Interceptor para manejar las solicitudes antes de enviarlas
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token desde localStorage o sessionStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // Si hay un token, agrégalo al encabezado Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interceptor para manejar respuestas de la API
apiClient.interceptors.response.use(
  (response) => response.data,  // Extrae directamente la data de la respuesta
  (error) => {
    const dispatch = useDispatch();

    if (error.response) {
      // Aquí tratamos los errores de respuesta de la API
      console.error('Error de respuesta:', error.response);
      dispatch(setError({ message: error.response.data.detail || 'Error desconocido' }));
      return Promise.reject(error.response);
    } else if (error.request) {
      // Si no hubo respuesta de la API
      console.error('Error de red:', error.message);
      dispatch(setError({ message: 'No se pudo conectar con el servidor' }));
      return Promise.reject({ message: 'No se pudo conectar con el servidor' });
    } else {
      // Error desconocido
      dispatch(setError({ message: 'Ocurrió un error inesperado' }));
      return Promise.reject({ message: 'Ocurrió un error inesperado' });
    }
  }
);

export default apiClient;


// Servicio API que usa Axios para hacer solicitudes
// Los interceptores ya estan diseñados para manejarerrores de forma centralizada.
// No es necesario duplicar esta lógica en los métodos del servicio
const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }),

  post: (url, data, config = {}) => apiClient.post(url, data, config),

  put: (url, data, config = {}) => apiClient.put(url, data, config),

  delete: (url, config = {}) => apiClient.delete(url, config),

  ping: () => apiClient.get('/ping'),
};

export { apiService };