import { useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { handleFileUpload } from '../utils/uploadUtils';
import { MediaContext } from '../contexts/MediaContext';
import { b64toBlob } from '../utils/audioUtils';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { transcriptionService } from '../service/transcribeService';
import '../styles.css'

const Dropzone = () => {
  const { setUploading, setAudioUrl, setTranscription } = useContext(MediaContext);

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
      const response = await handleFileUpload(file, '/api/audio');
      const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(response);
      const transcriptionText = transcriptionResponse.transcription;
      setTranscription(transcriptionText);
      //TODO translate request and setTranslate, include setTranslate on MediaContext
    } catch {
      // El error ya fue manejado por Redux en handleFileUpload
    } finally {
      setUploading(false);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'audio/mpeg': ['.mp3'] },
    maxSize: 100 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-400 p-2 text-center rounded-lg cursor-pointer w-full h-[240px] flex justify-center items-center box-border"

    >
      <input {...getInputProps()} />
      <div>
        <div className="text-sky-600 text-center">
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
            Arrastra y suelta un archivo <br />o <b className="text-sky-600">haz click para subir uno</b>
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
