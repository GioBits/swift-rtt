import { apiService } from './api';

export const getLanguages = async () => {
  try {
    const data = await apiService.get('api/languages');
    return data;
  } catch (error) {
    console.error('Error in languageService - getLanguages:', error);
    throw error;
  }
};