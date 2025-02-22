import { useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { MediaContext } from '../../contexts/MediaContext';
import { uploadMediaFile } from '../../service/mediaUploadService';
import addFileIllustration from '../../assets/add_files.svg';

const Dropzone = () => {
  const { setUploading, setAudioSelected } = useContext(MediaContext);

  const handleDrop = async (acceptFiles) => {
    const file = acceptFiles[0];
    await uploadMediaFile(file, setUploading, setAudioSelected);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'audio/mpeg': ['.mp3'] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-500 text-center rounded-lg cursor-pointer w-full flex justify-center items-center box-border h-full"
    >
      <input {...getInputProps()} />
      <div>
        <img
          src={addFileIllustration}
          alt="Agregar archivo"
          className="w-[30%] h-[30%] xl:w-[45%] xl:h-[45%] mx-auto mb-4 opacity-90"
        />
        <div>
          <p className='text-xl'>
            Arrastra y suelta un archivo <br />
            o <b className="text-primary font-extrabold">haz click para subir uno</b>
          </p>
          <span className="leading-[1.2] block mt-4 text-slate-500 whitespace-pre-wrap text-md">
            Admite solo formatos de audio mp3, hasta 10MB y 30 segundos de grabación.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
