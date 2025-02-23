import { handleMediaUpload } from '../utils/uploadUtils';

/**
 * Uploads an audio file and updates the context.
 * @param {File|Blob} file - Audio file or blob.
 * @param {Function} setUploading - Function to update the upload state.
 * @param {Function} setAudioSelected - Function to update the selected audio.
 * @param {Object} selectedLanguages - Object containing source and target languages.
 */
export const uploadMediaFile = async (file, setUploading, setAudioSelected, selectedLanguages) => {
  if (!file) return;

  setUploading(true);
  // console.log('selectedLanguages', selectedLanguages);
  
  try {
    const { sourceLanguage, targetLanguage } = selectedLanguages;
    const queryParams = new URLSearchParams({
      language_id_from: sourceLanguage,
      language_id_to: targetLanguage,
    }).toString();

    const response = await handleMediaUpload(file, `/api/audio?${queryParams}`);
    setAudioSelected({
      audioData: response.audio_data,
      audioId: response.id,
    });
  } finally {
    setUploading(false);
  }
};