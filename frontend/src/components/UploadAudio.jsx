import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';


// Componente UploadAudio para manejar la selección y carga de archivos de audio:
const UploadAudio = () => {
  
  // Estado para almacenar el archivo seleccionado:
  const [file, setFile] = useState(null);
  
  // Estado para mostrar si el archivo se está cargando:
  const [uploading, setUploading] = useState(false);

  // Referencia al input de archivo
  const fileInputRef = useRef(null);

  // Función que se activa cuando se selecciona un archivo:
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Guardamos el archivo en el estado
    if (selectedFile) {
      handleUpload(selectedFile); // Subimos el archivo automáticamente
    }
  };

  // Función para manejar el clic del botón
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Función para simular la carga del archivo:
  const handleUpload = (file) => {
    setUploading(true); // Se muestra el mensaje de "cargando..."

    // Simulamos una carga con un setTimeout:
    setTimeout(() => {
      setUploading(false); // Terminamos la carga
    }, 2000); // Simulamos 2 segundos de carga
  };

  // Elementos visuales del componente para manejar la selección y carga de archivos de audio:
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', maxWidth: '600px', margin: '20px auto' }}>
      <h3>Cargar archivo de audio</h3>
      <input
        type="file"
        accept="audio/mp3" // Permitimos solo archivos de audio
        onChange={handleFileChange} // Llamamos a la función cuando se selecciona el archivo
        style={{ display: 'none' }} // Ocultamos el input
        ref={fileInputRef}
      />
      <Button variant='contained' onClick={handleButtonClick} style={{ marginBottom: '10px' }}>
        Seleccionar Archivo de Audio
      </Button>
      {uploading && <p>Cargando archivo...</p>} {/* Mensaje de carga */}
    </div>
  );
};

export default UploadAudio; // Exportamos el componente para usarlo en otros archivos