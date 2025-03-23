import { apiService } from './api';

const StatsService = {
  /**
   * Gets user statistics by user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Object>} - Promise object containing user statistics.
   */
  getUserStats: async (userId) => {
    try {
      // Get user score
      const scoreResponse = await apiService.get(`/api/scores/user/${userId}`);
      
      // Get user's audio records
      const audioResponse = await apiService.get(`/api/process-media/user/${userId}`);
      
      // Get user's login records
      const loginResponse = await apiService.get(`/api/login-records/user/${userId}`);

      return {
        score: scoreResponse || { score: 0 },
        totalAudios: audioResponse?.total_items || 0,
        totalLogins: loginResponse?.length || 0,
        lastLogin: loginResponse?.[0]?.created_at || null
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        score: { score: 0 },
        totalAudios: 0,
        totalLogins: 0,
        lastLogin: null
      };
    }
  },
  getTopScores: async (limit) => {
    try {
      const response = await apiService.get(`/api/scores/top?n=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching top scores:', error);
      return [];
    }
  }
};

export default StatsService; 