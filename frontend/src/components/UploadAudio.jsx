import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { apiService } from '../service/api';

const UploadAudio = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null); // Estado para la URL del audio
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url); // Actualizar el estado con la URL del archivo seleccionado
      handleUpload(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append('uploadedAudio', file, file.name);

      const response = await apiService.post('/api/audio', formData);
      setSuccessMessage('Archivo de audio guardado en el servidor.');
      console.log('Archivo de audio guardado en el servidor:', response);
    } catch (error) {
      setErrorMessage('Error al guardar el archivo de audio: ' + error.message);
      console.error('Error al guardar el archivo de audio:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', maxWidth: '600px', margin: '20px auto' }}>
      <h3>Cargar archivo de audio</h3>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        id="upload-audio"
      />
      <Button variant='contained' onClick={handleButtonClick} style={{ marginBottom: '10px' }}>
        Seleccionar Archivo de Audio
      </Button>
      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {uploading && <p>Cargando archivo...</p>}
      {errorMessage && (
        <div style={{ color: 'red', marginTop: 20 }}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div style={{ color: 'green', marginTop: 20 }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default UploadAudio;