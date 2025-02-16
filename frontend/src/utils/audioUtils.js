import { fetchFile } from '@ffmpeg/util';
import { getMessage } from "@utils/localeHelper";

/**
 * Convierte un archivo de audio WAV a MP3 usando FFmpeg.
 *
 * @param {Object} ffmpeg - Instancia de FFmpeg cargada.
 * @param {Blob} audioBlob - Blob del audio grabado en formato WAV.
 * @returns {Promise<File>} - Devuelve el archivo MP3 convertido.
 */
export const convertWavToMp3 = async (ffmpeg, audioBlob) => {
  try {
    // Verifica que FFmpeg esté cargado
    if (!ffmpeg.load()) {
      throw new Error(getMessage("RecordAudio", "ffmpeg_not_loaded"));
    }

    // Convierte audioBlob en un archivo que FFmpeg pueda leer
    const wavFile = await fetchFile(audioBlob);

    // Escribe el archivo WAV en el sistema de archivos virtual de FFmpeg
    await ffmpeg.writeFile("input.wav", wavFile);

    // Ejecuta FFmpeg para convertir el archivo WAV a MP3
    await ffmpeg.exec(["-i", "input.wav", "output.mp3"]);

    // Lee el archivo MP3 resultante
    const mp3Data = await ffmpeg.readFile("output.mp3");

    // (Opcional) Elimina archivos temporales si FFmpeg proporciona un método para ello
    if (typeof ffmpeg.removeFile === "function") {
      await ffmpeg.removeFile("input.wav");
      await ffmpeg.removeFile("output.mp3");
    }

    // Crea un Blob y luego un File en formato MP3
    const mp3Blob = new Blob([mp3Data.buffer], { type: "audio/mp3" });
    return new File([mp3Blob], "recording.mp3", { type: "audio/mp3" });
  } catch (error) {
    console.error("Error al convertir audio a MP3:", error);
    throw new Error(getMessage("RecordAudio", "conversion_error", { error: error.message }));
  }
};

/**
 * Converts a base64 string to a Blob object.
 *
 * @param {string} b64Data - The base64 string to convert.
 * @param {string} [contentType=''] - The MIME type of the resulting Blob.
 * @param {number} [sliceSize=512] - The size of the chunks to process the base64 string.
 * @returns {Blob} - The resulting Blob object.
 */
export const b64toBlob = (b64Data, contentType='', sliceSize=512) => {

  if (!b64Data) {
    return null;
  }

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
    
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
};
