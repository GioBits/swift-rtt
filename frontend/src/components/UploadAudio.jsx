import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { handleFileUpload } from '../utils/uploadUtils';

const UploadAudio = () => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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
      await handleFileUpload(file, '/api/audio', dispatch);
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
    </div>
  );
};

export default UploadAudio;
