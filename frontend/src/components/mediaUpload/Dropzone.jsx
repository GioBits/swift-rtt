import { useDropzone } from 'react-dropzone';
import addFileIllustration from '../../assets/add_files.svg';

const Dropzone = ({ onFileSelected }) => {
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelected(file);
    } else {
      console.log('No se seleccionó ningún archivo'); // Revisar si es necesario
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'audio/mpeg': ['.mp3'] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-500 text-center rounded-lg cursor-pointer w-full flex justify-center items-center box-border h-full p-4 sm:p-6 md:p-8"
    >
      <input {...getInputProps()} />
      <div>
        <img
          src={addFileIllustration}
          alt="Agregar archivo"
          className="hidden sm:block w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/4 h-auto mx-auto mb-4 opacity-90 object-contain max-w-[200px]"
        />
        <div>
          <p className="text-base sm:text-md md:text-lg">
            Arrastra y suelta un archivo o <br />
            <b className="text-primary font-extrabold">haz click para subir uno</b>
          </p>
          <span className="leading-[1.2] block mt-4 text-slate-500 whitespace-pre-wrap text-xs">
            Admite solo formatos de audio mp3, hasta 10MB y 30 segundos de grabación.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
