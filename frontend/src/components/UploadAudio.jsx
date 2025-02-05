import { useRef, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { handleFileUpload } from '../utils/uploadUtils';
import { useDispatch} from 'react-redux';
import { clearError } from '../store/slices/errorSlice';
import { b64toBlob } from '../utils/audioUtils';
import { TranslationContext } from '../contexts/TranslationContext';
import "../styles.css";

const UploadAudio = () => {
  const { isRecording, setUploading, setAudioUrl } = useContext(TranslationContext);
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
      // El error ya fue manejado por Redux en handleFileUpload
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
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
        className='upload-button'
        onClick={() => fileInputRef.current.click()}
        disabled={isRecording} // se desactiva si `uploading` es verdadero
      >
        Subir audio
      </Button>
    </div>
  );
};

export default UploadAudio;
