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

  // const { message, type, origin } = useSelector(state => state.error);
  const { setUploading } = useContext(TranslationContext);
  const dispatch = useDispatch();


  const ffmpeg = new FFmpeg();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(dispatch, uploadAudio);

  return (
    <div>
      <div>
        <Button
          variant="contained"
          onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
        </Button>

        {/* {audioUrl && (
          <div style={{ marginTop: 20 }}>
            <audio controls src={audioUrl}></audio>
          </div>
        )}
        {uploading && <p>Cargando archivo...</p>}
        {type === 'error' && message && origin === "RecordAudio" && (
          <div style={{ color: 'red', marginTop: 20 }}>
            {message}
          </div>
        )}
        {type === "success" && message && origin === "RecordAudio" && (
          <div style={{ color: "green", marginTop: 20 }}>{message}</div>
        )} */}
      </div>
    </div>
  );
};

export default RecordAudio;