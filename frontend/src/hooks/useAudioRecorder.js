import { useCallback, useRef, useContext } from 'react';
import { MediaContext } from '@contexts/MediaContext';
import { setError } from '../store/slices/errorSlice';
import { getMessage } from '../utils/localeHelper';

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
