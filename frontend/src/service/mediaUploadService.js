import { handleMediaUpload } from '../utils/uploadUtils';

/**
 * Uploads an audio file and updates the context.
 * @param {File|Blob} file - Audio file or blob.
 * @param {Function} setUploading - Function to update the upload state.
 * @param {Function} setAudioSelected - Function to update the selected audio.
 */
export const uploadMediaFile = async (file, setUploading, setAudioSelected) => {
  if (!file) return;

  setUploading(true);
  try {
    const response = await handleMediaUpload(file, '/api/audio');
    setAudioSelected({
      audioData: response.audio_data,
      audioId: response.id,
    });
  } finally {
    setUploading(false);
  }
};
