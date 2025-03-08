import { useState, useContext } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import Confirm from './Confirm';
import { CircularProgress } from '@mui/material';
import { MediaContext } from '../../contexts/MediaContext';
import MediaUploadSelector from './MediaUploadSelector';
import AudioService from '../../service/audioService';
import { useSelector } from 'react-redux';

const MediaUpload = () => {
  const { getUploading, setUploading, setAudioSelected, selectedLanguages } = useContext(MediaContext);
  const [buttonSelected, setButtonSelected] = useState(true);
  const [isClicked, setIsClicked] = useState(true);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const userId = useSelector(state => state.auth.user.id);

  const handleButtonClick = (selected) => {
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  const handleFileSelected = (file) => {
    setFileToUpload(file);
    setShowConfirmation(true);
  };

  const handleConfirmation = async (confirmed) => {
    setShowConfirmation(false);
    if (confirmed && fileToUpload) {
      setUploading(true);
      try {
        const response = await AudioService.uploadAudio(fileToUpload, selectedLanguages, userId);
        setAudioSelected({
          audioData: response.audio_data,
          audioId: response.id,
        });
      } catch (error) {
        console.error("Error al subir el audio: ", error);
      } finally {
        setUploading(false);
      }
    }
    setFileToUpload(null);
  };

  const props = {
    isClicked: isClicked,
    buttonSelected: buttonSelected,
    handleButtonClick: handleButtonClick
  };

  return (
    <div className='box-border flex flex-col h-full w-full min-w-[400px] m-auto'>
      <MediaUploadSelector {...props} />
      <div className='box-border w-full h-[calc(100%-80px)] p-5 flex items-center justify-center'>
        {!getUploading ? (
          <CircularProgress />
        ) : showConfirmation ? (
          <Confirm handleConfirmation={handleConfirmation} />
        ) : buttonSelected ? (
          <Dropzone onFileSelected={handleFileSelected} />
        ) : (
          <RecordAudio onFileSelected={handleFileSelected} />
        )}
      </div>
    </div>
  );
};

export default MediaUpload;