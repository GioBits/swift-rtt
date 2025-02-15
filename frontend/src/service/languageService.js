import { apiService } from './api';

export const getLanguages = async () => {
  try {
    return await apiService.get('api/languages');
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
};