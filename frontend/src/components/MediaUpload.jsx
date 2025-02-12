import { useState } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import { Button } from '@mui/material';
import '../styles.css';

const MediaUpload = () => {
  const [buttonSelected, setButtonSelected] = useState(true); // Estado de selección
  const [isClicked, setIsClicked] = useState(false); // Estado para evitar la animación de clic

  const handleButtonClick = (selected) => {
    // Si el botón ya está seleccionado, no ejecutar la animación
    if (buttonSelected !== selected) {
      setIsClicked(true);
      setButtonSelected(selected);
    }
  };

  return (
    <div className='media-container'>
      <div className='button-upload'>
        <Button
          variant="contained"
          onClick={() => handleButtonClick(true)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected === true ? 'none' : 'auto', // Desactiva el clic si está seleccionado
          }}
          className='button-item'
        >
          Subir archivo
        </Button>
        <Button
          variant="contained"
          onClick={() => handleButtonClick(false)}
          sx={{
            textTransform: 'none',
            pointerEvents: isClicked && buttonSelected === false ? 'none' : 'auto', // Desactiva el clic si está seleccionado
          }}
          className='button-item'
        >
          Iniciar grabación
        </Button>
      </div>

      {/* Renderizamos el componente según la selección */}
      <div className='media-upload'>
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
