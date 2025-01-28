import { apiService } from '../service/api';
import { setError, setSuccess } from '../store/slices/errorSlice';

/**
 * Función para manejar la carga de archivos.
 * @param {File} file - El archivo a cargar.
 * @param {string} endpoint - El endpoint de la API donde se enviará el archivo.
 * @param {Function} dispatch - La función dispatch de Redux para manejar mensajes.
 */
export const handleFileUpload = async (file, endpoint, dispatch) => {
  const formData = new FormData();
  formData.append('uploadedAudio', file, file.name);

  try {
    await apiService.post(endpoint, formData);
    dispatch(setSuccess({ message: 'Archivo de audio guardado en el servidor.' }));
  } catch (error) {
    dispatch(setError({ message: error.message }));
    throw error; // Re-lanza el error en caso de necesitar manejarlo
  }
};
