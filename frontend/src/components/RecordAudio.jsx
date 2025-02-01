import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { handleFileUpload } from '../utils/uploadUtils';
import { clearError } from '../store/slices/errorSlice';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const RecordAudio = () => {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { message, type, origin } = useSelector(state => state.error);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    try {
      const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
      await handleFileUpload(audioFile, '/api/audio', dispatch, "RecordAudio");
    } finally {
      setUploading(false);
    }
  };

  const { isRecording, audioUrl, startRecording, stopRecording } = useAudioRecorder(dispatch, uploadAudio);


  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', maxWidth: '600px', margin: '20px auto' }}>
      <h3>Grabar un audio</h3>
      <div>
        {isRecording ? (
          <Button variant='contained' onClick={stopRecording}>Detener Grabación</Button>
        ) : (
          <Button variant='contained' onClick={startRecording}>Iniciar Grabación</Button>
        )}
        {audioUrl && (
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
        )}
      </div>
    </div>
  );
};

export default RecordAudio;
