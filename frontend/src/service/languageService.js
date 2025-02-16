import { apiService } from './api';

const parseLanguageResponse = (response) => {
  return {
    id: response.id || null,
    name: response.name || "",
    code: response.code || ""
  };
}

const languageService = {

  getLanguages: async () => {
    try {
      const response = await apiService.get('api/languages');
      return response.map(parseLanguageResponse);
    } catch (error) {
      console.error('Error fetching languages:', error);

      if (error.status === 404) {
        throw new Error('Languages not found.');
      } else if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Could not get languages.');
      }
    }
  },
};

export { languageService };