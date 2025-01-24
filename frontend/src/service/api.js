import axios from 'axios';

// Instancia de Axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,  // Tiempo de espera de 10 segundos
});

// Interceptor para manejar las solicitudes antes de enviarlas
apiClient.interceptors.request.use(
  (config) => {
    // Acá se puede agregar token de autenticación del usuario en caso de ser necesario
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
    if (error.response) {
      console.error('Error de respuesta:', error.response);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Error desconocido',
      });
    } else if (error.request) {
      console.error('Error de red:', error.message);
      return Promise.reject({ message: 'No se pudo conectar con el servidor' });
    } else {
      return Promise.reject({ message: 'Ocurrió un error inesperado' });
    }
  }
);

export default apiClient;
