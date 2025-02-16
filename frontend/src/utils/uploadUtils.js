import { apiService } from '@service/api';
import { toast } from 'react-hot-toast';

/**
 * Function to handle file upload.
 * @param {File} file - The file to upload.
 * @param {string} endpoint - The API endpoint where the file will be sent.
*/

export const handleFileUpload = async (file, endpoint) => {
  const formData = new FormData();
  formData.append("file", file); 

  try {
    const response = await apiService.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success('Archivo de audio guardado!',  {duration: 5000});
    return response;

  } catch (error) {
    console.log(error);
    throw error;
  }
};
