import { apiService } from './api';

const parseProviderResponse = (response) => {
  return {
    id: response.id || null,
    name: response.name || "",
    type: response.type || ""
  };
}

const providerService = {

  getProviders: async () => {
    try {
      const response = await apiService.get('api/providers');
      return response;
    } catch (error) {
      console.error('Error fetching providers:', error);

      if (error.status === 404) {
        throw new Error('Providers not found.');
      } else if (error.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Could not get providers.');
      }
    }
  }
};

export { providerService };