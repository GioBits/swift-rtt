import React, { useState } from 'react';

// Componente UploadAudio para manejar la selección y carga de archivos de audio:
const UploadAudio = () => {
  
  // Estado para almacenar el archivo seleccionado:
  const [file, setFile] = useState(null);
  
  // Estado para mostrar si el archivo se está cargando:
  const [uploading, setUploading] = useState(false);

  // Función que se activa cuando se selecciona un archivo:
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Guardamos el archivo en el estado
    if (selectedFile) {
      handleUpload(selectedFile); // Subimos el archivo automáticamente
    }
  };

  // Función para simular la carga del archivo:
  const handleUpload = (file) => {
    setUploading(true); // Se muestra el mensaje de "cargando..."

    // Simulamos una carga con un setTimeout:
    setTimeout(() => {
      setUploading(false); // Terminamos la carga
    }, 2000); // Simulamos 2 segundos de carga
  };
};