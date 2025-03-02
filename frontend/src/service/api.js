import axios from 'axios';


// Instancia de Axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8000',
  timeout: 60000,  // Tiempo de espera de 60 segundos
});
console.log(import.meta.env)

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

    if (error.response) {
      // Aquí tratamos los errores de respuesta de la API
      console.error('Error de respuesta:', error.response);
      return Promise.reject(error.response);
    } else if (error.request) {
      // Si no hubo respuesta de la API
      console.error('Error de red:', error.message);
      return Promise.reject({ message: 'No se pudo conectar con el servidor' });
    } else {
      // Error desconocido
      return Promise.reject({ message: 'Ocurrió un error inesperado' });
    }
  }
);

export default apiClient;


// Servicio API que usa Axios para hacer solicitudes
const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }),

  post: (url, data, config = {}) => apiClient.post(url, data, config),

  put: (url, data, config = {}) => apiClient.put(url, data, config),

  delete: (url, config = {}) => apiClient.delete(url, config),

  ping: () => apiClient.get('/ping'),
};

export { apiService };