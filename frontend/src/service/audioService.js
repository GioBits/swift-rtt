import { apiService } from './api';
import { toast } from 'react-hot-toast';

const AudioService = {
  /**
   * Uploads an audio file.
   * @param {File|Blob} file - Audio file or blob.
   * @param {Object} selectedLanguages - Object containing source and target languages.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  uploadAudio: async (file, selectedLanguages, userId) => {
    const { sourceLanguage, targetLanguage } = selectedLanguages;
    const queryParams = new URLSearchParams({
      language_id_from: sourceLanguage,
      language_id_to: targetLanguage,
      user_id: userId
    }).toString();
    
    const path = `/api/audio?${queryParams}`;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.post(path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success('Archivo de audio guardado!', { duration: 5000 });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

export default AudioService;
