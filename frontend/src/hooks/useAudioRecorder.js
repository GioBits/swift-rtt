import { useCallback, useRef, useContext } from 'react';
import { MediaContext } from '@contexts/MediaContext';
import { getMessage } from '../utils/localeHelper';

/**
 * Custom hook to handle audio recording functionality.
 *
 * This hook allows you to start and stop recording audio using the 
 * MediaRecorder API. It handles recording duration limits, error management,
 * and uploading the recorded audio after stopping the recording.
 *
 * @param {Function} uploadAudio - A function to upload the recorded audio (e.g., to a backend server).
 * @param {Object} options - Configuration options for the recording behavior.
 * @param {number} options.minRecordingTime - Minimum duration of the recording in milliseconds (default is 3000ms).
 * @param {number} options.maxRecordingTime - Maximum duration of the recording in milliseconds (default is 30000ms).
 *
 * @returns {Object} - An object containing:
 *    - `startRecording`: Function to start recording audio.
 *    - `stopRecording`: Function to stop the audio recording manually.
 */
export const useAudioRecorder = (
  uploadAudio,
  { minRecordingTime = 3000, maxRecordingTime = 30000 } = {}
) => {
  const { setIsRecording } = useContext(MediaContext);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const startRecording = useCallback(() => {
    audioChunksRef.current = [];
    startTimeRef.current = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const endTime = Date.now();
          const duration = endTime - startTimeRef.current;

          if (duration < minRecordingTime) {
            console.error(getMessage("RecordAudio", "min_duration_error"));
            setIsRecording(false);
            return;
          }

          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            await uploadAudio(audioBlob);
          } catch (uploadError) {
            console.error("Error uploading audio:", uploadError);
          } finally {
            audioChunksRef.current = [];
          }
        };

        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxRecordingTime);
      })
      .catch((error) => {
        console.error(
          getMessage("RecordAudio", "mic_access_error", { error: error.message })
        );
      });
  }, [setIsRecording, minRecordingTime, maxRecordingTime, uploadAudio]);

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [setIsRecording]);

  return { startRecording, stopRecording };
};
