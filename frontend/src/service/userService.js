import { apiService } from './api';
import { toast } from 'react-hot-toast';

const UserService = {
  /**
   * Creates a new user.
   * @param {Object} userData - Object containing user data.
   * @param {string} userData.email - The email of the user.
   * @param {string} userData.password - The password hash of the user.
   * @param {string} userData.firstName - The first name of the user.
   * @param {string} userData.lastName - The last name of the user.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  registerUser: async (userData) => {
    const queryParams = new URLSearchParams({
      email: userData.email,
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
   * @param {string} loginData.email - The email of the user.
   * @param {string} loginData.password - The password of the user.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  login: async (loginData) => {
    const queryParams = new URLSearchParams({
      email: loginData.email,
      password: loginData.password,
    }).toString();

    const path = `/api/auth/login?${queryParams}`;
    
    try {
      const response = await apiService.post(path);
      toast.success('Inicio de sesión exitoso!', { duration: 5000 });
      return response;
    } catch (error) {
      console.error(error);
      toast.error('Error al iniciar sesión.', { duration: 5000 });
      throw error;
    }
  }
};

export default UserService;