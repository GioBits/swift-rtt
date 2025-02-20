import { useCallback, useRef, useContext } from 'react';
import { MediaContext } from '@contexts/MediaContext';
import { setError } from '../store/slices/errorSlice';
import { getMessage } from '../utils/localeHelper';

/**
 * Custom hook to handle audio recording functionality.
 * 
 * This hook allows you to start and stop recording audio using the 
 * MediaRecorder API. It handles recording duration limits, error management,
 * and uploading the recorded audio after stopping the recording.
 * 
 * @param {Function} dispatch - The Redux `dispatch` function used to dispatch actions.
 * @param {Function} uploadAudio - A function to upload the recorded audio (e.g., to a backend server).
 * @param {Object} options - Configuration options for the recording behavior.
 * @param {number} options.minRecordingTime - Minimum duration of the recording in milliseconds (default is 3000ms).
 * @param {number} options.maxRecordingTime - Maximum duration of the recording in milliseconds (default is 30000ms).
 * 
 * @returns {Object} - An object containing the following methods:
 *    - `startRecording`: Function to start recording audio.
 *    - `stopRecording`: Function to stop the audio recording manually.
 */
export const useAudioRecorder = (dispatch, uploadAudio, {
  minRecordingTime = 3000,
  maxRecordingTime = 30000
} = {}) => {
  const { setIsRecording } = useContext(MediaContext);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const startRecording = useCallback(() => {
    audioChunksRef.current = [];
    startTimeRef.current = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
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
            dispatch(setError({
              message: getMessage("RecordAudio", "min_duration_error"),
              origin: "RecordAudio"
            }));
            setIsRecording(false);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await uploadAudio(audioBlob);
          audioChunksRef.current = [];
        };

        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxRecordingTime);
      })
      .catch(error => {
        dispatch(setError({
          message: getMessage("RecordAudio", "mic_access_error", { error: error.message }),
          origin: "RecordAudio"
        }));
      });
  }, [dispatch, setIsRecording, minRecordingTime, maxRecordingTime, uploadAudio]);

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [setIsRecording]);

  return { startRecording, stopRecording };
};
