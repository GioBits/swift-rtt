import { useState, useContext } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import { Button, CircularProgress } from '@mui/material';
import { MediaContext } from '@contexts/MediaContext';

const MediaUpload = () => {
  const { uploading } = useContext(MediaContext);
  const [buttonSelected, setButtonSelected] = useState(true);
  const [isClicked, setIsClicked] = useState(true);

  const handleButtonClick = (selected) => {
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-[410px] m-auto bg-white mt-0 rounded-b-lg p-10 pt-0'>
      <div className='w-full flex flex-row space-between h-auto m-auto'>
        <Button
          variant={isClicked && buttonSelected ? 'contained' : 'outlined'}
          onClick={() => handleButtonClick(true)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected ? 'none' : 'auto',
            width: '50%',
            height: '50px',
            margin: '10px',
            backgroundColor: isClicked && buttonSelected ? 'rgb(2 132 199)' : 'white'
          }}
        >
          Subir archivo
        </Button>
        <Button
          variant={isClicked && buttonSelected ? 'outlined' : 'contained'}
          onClick={() => handleButtonClick(false)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected === false ? 'none' : 'auto',
            width: '50%',
            height: '50px',
            margin: '10px',
            backgroundColor: isClicked && buttonSelected ? 'white' : 'rgb(2 132 199)'
          }}
        >
          Grabar
        </Button>
      </div>

      <div className='box-border w-full bg-white h-[260px] p-2 flex items-center justify-center'>
        {uploading ? (
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
