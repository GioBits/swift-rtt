import { apiService } from './api';
import { toast } from 'react-hot-toast';

const AudioService = {
  /**
   * Uploads an audio file.
   * @param {File|Blob} file - Audio file or blob.
   * @param {Object} selectedLanguages - Object containing source and target languages.
   * @param {number} userId - ID of the user uploading the file.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  uploadAudio: async (file, selectedLanguages, userId) => {
    const { sourceLanguage, targetLanguage } = selectedLanguages;
    const queryParams = new URLSearchParams({
      language_id_from: sourceLanguage,
      language_id_to: targetLanguage,
      user_id: userId,
    }).toString();

    const path = `/api/audio?${queryParams}`;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.post(path, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Archivo de audio guardado!', { duration: 5000 });
      return response; // Return only the response data
    } catch (error) {
      console.error(error);
      toast.error('Error uploading the audio file');
      throw error;
    }
  },

  /**
   * Processes an uploaded audio file.
   * @param {number} userId - ID of the user.
   * @param {number} audioRecordId - ID of the audio record.
   * @param {Object} selectedLanguages - Object containing source and target languages.
   * @returns {Promise<Object>} - Promise object representing the response.
   */
  processMedia: async (userId, audioRecordId, selectedLanguages) => {
    const path = '/api/process-media';
    const { sourceLanguage, targetLanguage } = selectedLanguages;
    const queryParams = new URLSearchParams({
      user_id: userId,
      audio_id: audioRecordId,
      language_id_from: sourceLanguage,
      language_id_to: targetLanguage,
    }).toString();

    try {
      const response = await apiService.post(`${path}?${queryParams}`, {});
      toast.success('Iniciando procesamiento de audio!', { duration: 5000 });
      return response;
    } catch (error) {
      console.error(error);
      toast.error('Error processing the audio file');
      throw error;
    }
  },
};

export default AudioService;