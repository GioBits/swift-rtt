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

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const fileUploadedBase64 = await uploadFile(file);
      const blob = b64toBlob(fileUploadedBase64, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  };

  
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
      class="border border-dashed border-gray-400 p-2 text-center rounded-lg cursor-pointer w-full h-[240px] flex justify-center items-center box-border"

    >
      <input {...getInputProps()} />
      <div>
        <div class="text-sky-600 text-center">
          <AddCircleOutlineOutlinedIcon
            sx={{
              display: 'flex',
              margin: 'auto',
              fontSize: '40px'
            }}
          />

        </div>
          <div>
          <p style={{ color: 'black', fontSize: '1rem' }}>
            Arrastra y suelta un archivo <br />o <b class="text-sky-600">haz click para subir uno</b>
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
