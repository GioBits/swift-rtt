import { apiService } from './api';

const processMediaService = {
  getProcessMediaByUserAll: async (userId) => {
    const path = `/api/process-media/user/${userId}`;
    let allItems = [];
    let page = 1;
    const size = 10;
    let totalPages = 1;

    try {
      do {
        const response = await apiService.get(path, { params: { page, size } });
        const data = response.data ? response.data : response;

        if (!data || !Array.isArray(data.items)) {
          break;
        }

        allItems = allItems.concat(data.items);

        totalPages = data.total_pages || page;
        page++;
      } while (page <= totalPages);

      allItems.reverse();

      return {
        data: {
          items: allItems,
          total_items: allItems.length,
          total_pages: 1,
          current_page: 1
        }
      };

    } catch (error) {
      return {
        data: {
          items: [],
          total_items: 0,
          total_pages: 0,
          current_page: 0
        }
      };
    }
  },
};

export default processMediaService;
