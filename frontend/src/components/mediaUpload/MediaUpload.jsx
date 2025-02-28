import { useState, useContext } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import { CircularProgress } from '@mui/material';
import { MediaContext } from '../../contexts/MediaContext';
import MediaUploadSelector from './MediaUploadSelector';

const MediaUpload = () => {
  const { getUploading } = useContext(MediaContext);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(true);

  const handleButtonClick = (selected) => {
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  const props = {
    isClicked: isClicked,
    buttonSelected: buttonSelected,
    handleButtonClick: handleButtonClick
  }

  return (
    <div className='box-border flex flex-col h-full w-full mix-w-[400px] m-auto'>
      <MediaUploadSelector {...props} />
      <div className='box-border w-full h-[calc(100%-80px)] p-5 flex items-center justify-center'>
        {!getUploading ? (
          <CircularProgress />
        ) : buttonSelected ? (
          <Dropzone />
        ) : (
          <RecordAudio />
        )}
      </div>
    </div>
  );
}

export default MediaUpload;
