import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { handleFileUpload } from '../utils/uploadUtils';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../store/slices/errorSlice';
import { b64toBlob } from '../utils/audioUtils';

const UploadAudio = () => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const { message, type, origin } = useSelector(state => state.error);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  

  const handleFileChange = async (event) => {
    setAudioUrl(null);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileUploadedBase64 = await uploadFile(selectedFile);
      const blob = b64toBlob(fileUploadedBase64, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fileBase64 = await handleFileUpload(file, '/api/audio', dispatch, "UploadAudio");
      return fileBase64;
    } catch {
      // El error ya fue manejado por Redux
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='upload-input'>
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
