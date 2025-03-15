import { useState, useContext } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import Confirm from './Confirm';
import DisplayAudioWave from './DisplayAudioWave';
import { CircularProgress } from '@mui/material';
import { MediaContext } from '../../contexts/MediaContext';
import MediaUploadSelector from './MediaUploadSelector';
import NewAudioButton from './NewAudioButton';

const MediaUpload = () => {
  const { isUploading, mediaSelected, setMediaSelected } = useContext(MediaContext);
  const [buttonSelected, setButtonSelected] = useState(true); // State for selected button (Dropzone or RecordAudio)
  const [isClicked, setIsClicked] = useState(true); // State to track if a button is clicked
  const [fileToUpload, setFileToUpload] = useState(null); // State to store the file to upload


  // Handle button click to switch between Dropzone and RecordAudio
  const handleButtonClick = (selected) => {
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  // Handle file selection (from Dropzone or RecordAudio)
  const handleFileSelected = (file) => {
    setFileToUpload(file); // Set the file to upload
  };

  const handleNewAudio = () => {
    setMediaSelected({ data: '', id: '' });
    setFileToUpload(null);
  }

  // Props to pass to MediaUploadSelector
  const props = {
    isClicked: isClicked,
    buttonSelected: buttonSelected,
    handleButtonClick: handleButtonClick
  };

  // Logic to handle the content to render
  const renderContent = () => {
    if (isUploading) {
      return <CircularProgress />;
    }

    if (fileToUpload) {
      return (
        <>
          <DisplayAudioWave file={fileToUpload} />
          <Confirm
            file={fileToUpload}
            audioId={mediaSelected.id}
            handleNewAudio={handleNewAudio} />
        </>
      )
    }

    if (buttonSelected) {
      return <Dropzone onFileSelected={handleFileSelected} />;
    }

    return <RecordAudio onFileSelected={handleFileSelected} />;
  };

  return (
    <div className='box-border flex flex-col h-full w-full m-auto'>
      {/* Render the MediaUploadSelector component or upload NewAudioButton*/}
      {fileToUpload
        ? <NewAudioButton onClick={handleNewAudio}  buttonSelected={buttonSelected} />
        : <MediaUploadSelector {...props} />}

      {/* Main content area */}
      <div className="box-border w-[90%] m-auto h-full mt-[20px] mb-[20px] flex items-center justify-center">
        <div className="h-full w-full flex flex-col justify-center items-center border border-dashed border-gray-400 rounded-lg box-border sm:p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;