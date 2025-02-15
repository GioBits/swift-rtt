import { apiService } from './api';

const parseTranslationResponse = (response) => {
  return {
    audioId: response.audio_id || null,
    providerId: response.provider_id || null,
    languageId: response.language_id || null,
    translation: response.translation_text || "",
    translationId: response.translation_id || null
  };
}

const translationService = {

  getTranslationById: async (id) => {
    try {
      const path = `/api/translations/${id}`;
      const response = await apiService.get(path);
      return parseTranslationResponse(response);
    }
    catch (error) {
      console.log('Error fetching translation:', error);
    }
  },

  getTranslationByAudioId: async (id) => {
    try {
      const path = `/api/translations/audio/${id}`;
      const response = await apiService.get(path);
      return parseTranslationResponse(response.pop());
    }
    catch (error) {
      console.log('Error fetching translation:', error);
    }
  },

  postTranslation: async (id, provider) => {
    try {
      const path = `/api/translations?audio_id=${id}&provider_id=${provider}`;
      const response = await apiService.post(path);
      return parseTranslationResponse(response);
    } catch (error) {
      console.log('Error sending translation:', error);
    }
  }
};

export { translationService };