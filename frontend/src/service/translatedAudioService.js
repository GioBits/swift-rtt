import { apiService } from './api';

const parseTranslatedAudioResponse = (response) => {
  return {
    audioId: response.audio_id || null,
    translationId: response.translation_id || null,
    providerId: response.provider_id || null,
    languageId: response.language_id || null,
    fileSize: response.file_size || null,
    transcription: response.transcription || null,
    createdAt: response.created_at || null,
    id: response.id || null,
    audioData: response.audio_data || null
  };
};

const translatedAudioService = {

  getTranslatedAudioById: async (id) => {
    try {
      const path = `/api/translated_audios/${id}`;
      const response = await apiService.get(path);
      return parseTranslatedAudioResponse(response);
    } catch (error) {
      console.error('Error fetching translated audio by id:', error);
      throw error;
    }
  },

  getTranslatedAudioByAudioId: async (audioId) => {
    try {
      const path = `/api/translated_audios/audio/${audioId}`;
      const response = await apiService.get(path);
      return parseTranslatedAudioResponse(response.pop());
    } catch (error) {
      console.error('Error fetching translated audio by audioId:', error);
      throw error;
    }
  },

  postTranslatedAudio: async (audioId, providerId) => {
    try {
      const path = `/api/translated_audios?audio_id=${audioId}&provider_id=${providerId}`;
      const response = await apiService.post(path);
      return parseTranslatedAudioResponse(response);
    } catch (error) {
      console.error('Error sending translated audio:', error);
      throw error;
    }
  }
};

export { translatedAudioService };
