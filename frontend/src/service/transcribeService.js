import { apiService } from './api';

const parseTranscriptionResponse = (response) => {
  return {
    audioId: response.audio_id || null,
    providerId: response.provider_id || null,
    languageId: response.language_id || null,
    transcription: response.transcription_text || "",
    transcriptionId: response.transcription_id || null
  };
}

const transcriptionService = {

  getTranscriptionById: async (id) => {
    try {
      const path = `/api/transcriptions/${id}`;
      const response = await apiService.get(path);
      return parseTranscriptionResponse(response);
    } catch (error) {
      console.log('Error al obtener la transcripción:', error);
    }
  },

  getTranscriptionByAudioId: async (id) => {
    try {
      const path = `/api/transcriptions/audio/${id}`;
      const response = await apiService.get(path);
      return parseTranscriptionResponse(response.pop());
    } catch (error) {
      console.log('Error al obtener la transcripción:', error);
    }
  },

  postTranscription: async (id, provider) => {
    try {
      const path = `/api/transcriptions?audio_id=${id}&provider_id=${provider}`;
      const response = await apiService.post(path);
      return parseTranscriptionResponse(response);
    } catch (error) {
      console.log('Error al enviar la transcripción:', error);
    }
  },
};

export { transcriptionService };
