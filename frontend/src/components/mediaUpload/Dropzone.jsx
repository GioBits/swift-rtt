import { useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { handleFileUpload } from '../../utils/uploadUtils';
import { MediaContext } from '../../contexts/MediaContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const Dropzone = () => {
  const {
    setUploading,
    setAudioSelected
  } = useContext(MediaContext);

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) {
      return;
    }

    setUploading(true);
    const response = await handleFileUpload(file, '/api/audio');
    setAudioSelected({
      audioData: response.audio_data,
      audioId: response.id,
    });
    setUploading(false);
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
          <span className='leading-[1.2] block mt-4 text-slate-500 whitespace-pre-wrap text-xs'>
            Admite solo formatos de audio mp3, hasta 10MB y 30 segundos de grabación.
          </span>
        </div>

      </div>
    </div>
  );
};

export default Dropzone;
