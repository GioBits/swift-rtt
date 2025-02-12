import { useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { handleFileUpload } from '../utils/uploadUtils';
import { useDispatch } from 'react-redux';
import { MediaContext } from '../contexts/MediaContext';
import { b64toBlob } from '../utils/audioUtils';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import '../styles.css'

const Dropzone = () => {
  const dispatch = useDispatch();
  const { setUploading, setAudioUrl } = useContext(MediaContext);

  // Manejo de archivos arrastrados o seleccionados
  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]; // Tomamos el primer archivo

    if (file) {
      const fileUploadedBase64 = await uploadFile(file);
      const blob = b64toBlob(fileUploadedBase64, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url); // Establecer la URL para reproducir el archivo
    }
  };

  // Llamada a la función que maneja la carga del archivo
  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fileBase64 = await handleFileUpload(file, '/api/audio', dispatch, "Dropzone");
      return fileBase64;
    } catch {
      // El error ya fue manejado por Redux en handleFileUpload
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'audio/mp3',
    maxSize: 100 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className='dropzone'
    >
      <input {...getInputProps()} />
      <div>
          <AddCircleOutlineOutlinedIcon
            className='dropzone-icon'
          />
          <div>
          <p style={{ color: 'black', fontSize: '1rem' }}>
            Arrastra y suelta un archivo <br />o <b className='dropzone-bold'>haz click para subir uno</b>
          </p>
          <span className='dropzone-span'>
            Admite solo formatos de audio mp3, hasta 10MB y 30 segundos de grabación.
          </span>
          </div>
        
      </div>
    </div>
  );
};

export default Dropzone;
