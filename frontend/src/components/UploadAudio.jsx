import { useRef, useContext } from 'react';
import Button from '@mui/material/Button';
import { handleFileUpload } from '../utils/uploadUtils';
import { useDispatch} from 'react-redux';
import { clearError } from '../store/slices/errorSlice';
import { b64toBlob } from '../utils/audioUtils';
import { MediaContext } from '../contexts/MediaContext';
import "../styles.css";

const UploadAudio = () => {
  const { isRecording, setUploading, setAudioUrl } = useContext(MediaContext);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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
    <div className='upload-file'>
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
        onClick={() => {
          dispatch(clearError());
          setAudioUrl(null);
          fileInputRef.current.value = "";
          fileInputRef.current.click();
        }}
        disabled={isRecording}
      >
        Subir audio
      </Button>
    </div>
  );
};

export default UploadAudio;
