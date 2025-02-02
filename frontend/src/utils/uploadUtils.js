import { apiService } from '../service/api';
import { setError, setSuccess } from '../store/slices/errorSlice';
import { getMessage } from '../utils/localeHelper';

/**
 * Función para manejar la carga de archivos.
 * @param {File} file - El archivo a cargar.
 * @param {string} endpoint - El endpoint de la API donde se enviará el archivo.
 * @param {Function} dispatch - La función dispatch de Redux para manejar mensajes.
 * @param {string} origin - Propiedad que identifica el componente origen del mensaje
 */
export const handleFileUpload = async (file, endpoint, dispatch, origin) => {
  const formData = new FormData();
  formData.append('uploadedAudio', file, file.name);

  try {
    const response = await apiService.post(endpoint, formData);
    dispatch(setSuccess({ message: response.transcription, origin: origin }));
  } catch (error) {
    dispatch(setError({ message: getMessage("UploadAudio", "error", { error: error.message }), origin: origin }));
    throw error; // Re-lanza el error en caso de necesitar manejarlo
  }
};
