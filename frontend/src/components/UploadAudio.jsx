import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { handleFileUpload } from '../utils/uploadUtils';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../store/slices/errorSlice';

const UploadAudio = () => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const { message, type, origin } = useSelector(state => state.error);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      await handleFileUpload(file, '/api/audio', dispatch, "UploadAudio");
    } catch {
      // El error ya fue manejado por Redux
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        maxWidth: '600px',
        margin: '20px auto',
      }}
    >
      <h3>Cargar archivo de audio</h3>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        id="upload-audio"
      />
      <Button
        variant="contained"
        onClick={() => fileInputRef.current.click()}
        style={{ marginBottom: '10px' }}
      >
        Seleccionar Archivo de Audio
      </Button>
      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {uploading && <p>Cargando archivo...</p>}
        {type === 'error' && message && origin === "UploadAudio" && (
          <div style={{ color: 'red', marginTop: 20 }}>
            {message}
          </div>
        )}
        {type === "success" && message && origin === "UploadAudio" && (
          <div style={{ color: "green", marginTop: 20 }}>{message}</div>
        )}
    </div>
  );
};

export default UploadAudio;
