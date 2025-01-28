import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux'; // Importar useDispatch y useSelector
import { apiService } from '../service/api';
import { setError, setSuccess, clearError } from '../store/slices/errorSlice'; // Importar las acciones de Redux

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch(); // Hook para usar dispatch de Redux
  const { message, type } = useSelector(state => state.error); // Obtener el estado de error desde Redux

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const maxRecordingTime = 10000; // 10 seconds
  const minRecordingTime = 3000; // 3 seconds

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
            dispatch(setError({ message: 'La grabación debe durar al menos 3 segundos.' }));
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
        dispatch(setError({ message: 'Error al acceder al micrófono: ' + error.message }));
        console.error('Error al acceder al micrófono:', error);
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
      const formData = new FormData();
      formData.append('uploadedAudio', audioBlob, 'recording.wav');

      const response = await apiService.post('/api/audio', formData);
      dispatch(setSuccess({ message: 'Archivo de audio guardado en el servidor.' }));
      console.log('Archivo de audio guardado en el servidor:', response);
    } catch (error) {
      dispatch(setError({ message: 'Error al guardar el archivo de audio: ' + error.message }));
      console.error('Error al guardar el archivo de audio:', error);
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
        {type === 'error' && message && (
          <div style={{ color: 'red', marginTop: 20 }}>
            {message}
          </div>
        )}
        {type === 'success' && message && (
          <div style={{ color: 'green', marginTop: 20 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAudio;
