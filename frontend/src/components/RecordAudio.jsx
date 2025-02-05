import { useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { handleFileUpload } from '../utils/uploadUtils';
import { clearError } from '../store/slices/errorSlice';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { convertWavToMp3 } from '../utils/audioUtils';
import { TranslationContext } from '../contexts/TranslationContext';


const RecordAudio = () => {
  const { isRecording, setUploading } = useContext(TranslationContext);
  const dispatch = useDispatch();
  const ffmpeg = new FFmpeg();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, isRecording]);

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    try {
      await ffmpeg.load();
      const mp3File = await convertWavToMp3(ffmpeg, audioBlob);
      await handleFileUpload(mp3File, '/api/audio', dispatch, "RecordAudio");
    } finally {
      setUploading(false);
    }
  };

  const { startRecording, stopRecording } = useAudioRecorder(dispatch, uploadAudio);

  return (
    <div>
      <Button
        variant="contained"
        onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
      </Button>
    </div>
  );
};

export default RecordAudio;