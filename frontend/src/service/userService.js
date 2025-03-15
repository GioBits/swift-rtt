import { apiService } from './api';
import { toast } from 'react-hot-toast';

const UserService = {
  /**
   * Creates a new user.
   * @param {Object} userData - Object containing user data.
   * @param {string} userData.username - The username of the user.
   * @param {string} userData.password - The password hash of the user.
   * @param {string} userData.firstName - The first name of the user.
   * @param {string} userData.lastName - The last name of the user.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  registerUser: async (userData) => {
    const queryParams = new URLSearchParams({
      username: userData.username,
      password: userData.password,
      first_name: userData.name,
      last_name: userData.lastname,
    }).toString();

    const path = `/api/users?${queryParams}`;
    
    try {
      const response = await apiService.post(path);
      toast.success('Usuario creado exitosamente!', { duration: 5000 });
      return response;
    } catch (error) {
      console.error(error);
      toast.error('Error al crear el usuario.', { duration: 5000 });
      throw error;
    }
  },

  /**
   * Logs in a user.
   * @param {Object} loginData - Object containing login data.
   * @param {string} loginData.username - The username of the user.
   * @param {string} loginData.password - The password of the user.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  login: async (loginData) => {
    const queryParams = new URLSearchParams({
      username: loginData.username,
      password: loginData.password,
    }).toString();

    const path = `/api/auth/login?${queryParams}`;
    
    try {
      document.cookie = `session_token=; secure; httponly;`;
      const response = await apiService.post(path);
      document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      const userData = await apiService.get("api/users/me");
      toast.success('Inicio de sesión exitoso!', { duration: 5000 });
      return userData;
    } catch (error) {
      console.error(error);
      toast.error('Error al iniciar sesión.', { duration: 5000 });
      throw error;
    }
  },

  /**
   * User logout.
   * @returns {Promise<void>} - Promise object representing the response.
   */
  logout: async () => {
    try {
      await apiService.post("/api/auth/logout");
      toast.success("Sesión cerrada correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar sesión.");
      throw error;
    }
  }
};

export default UserService;