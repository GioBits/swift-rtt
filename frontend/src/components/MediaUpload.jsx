import { useState } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import { Button } from '@mui/material';
import '../styles.css';

const MediaUpload = () => {
  const [buttonSelected, setButtonSelected] = useState(true);
  const [isClicked, setIsClicked] = useState(true);

  const handleButtonClick = (selected) => {
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-[350px] m-auto bg-white mt-0 rounded-b'>
      <div className='w-full flex flex-row space-between h-auto m-auto'>
        <Button
          variant="contained"
          onClick={() => handleButtonClick(true)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected === true ? 'none' : 'auto',
            width: '50%',
            height: '50px',
            margin: '10px',
          }}
        >
          Subir archivo
        </Button>
        <Button
          variant="contained"
          onClick={() => handleButtonClick(false)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected === false ? 'none' : 'auto',
            width: '50%',
            height: '50px',
            margin: '10px',

          }}
        >
          Iniciar grabación
        </Button>
      </div>

      <div className='box-border w-full bg-white h-[260px] p-2 rounded-lg'>
        {buttonSelected ? (
          <Dropzone />
        ) : (
          <RecordAudio />
        )}
      </div>
    </div>
  );
}

export default MediaUpload;
