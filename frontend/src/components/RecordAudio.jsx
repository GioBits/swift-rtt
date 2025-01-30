import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux'; // Importar useDispatch y useSelector
import { handleFileUpload } from '../utils/uploadUtils';
import { setError, clearError } from '../store/slices/errorSlice'; // Importar las acciones de Redux
import { getMessage } from '../utils/localeHelper';

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch(); // Hook para usar dispatch de Redux
  const { message, type, origin } = useSelector(state => state.error); // Obtener el estado de error desde Redux

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const maxRecordingTime = 10000; // 10 seconds
  const minRecordingTime = 3000; // 3 seconds

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const startRecording = () => {
    // Limpiar el estado antes de iniciar una nueva grabación
    setAudioUrl(null);
    dispatch(clearError()); // Limpiar los mensajes anteriores
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
              origin: "RecordAudio",
            }));
            setIsRecording(false);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
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
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    try {
      // Convierte el audioBlob en un archivo para subirlo
      const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
  
      await handleFileUpload(audioFile, '/api/audio', dispatch, "RecordAudio");
    } finally {
      setUploading(false);
    }
  };

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
        {/* Mostrar mensajes de error y éxito desde Redux */}
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
