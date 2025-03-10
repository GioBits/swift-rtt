import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import PropTypes from 'prop-types';

const NewAudioButton = ({ onClick, buttonSelected }) => {
  return (
    <div className='flex h-[80px] w-[90%] m-auto'>

      <Button
        variant="contained"
        onClick={onClick}
        color="secondary"
        sx={{
          textTransform: 'none',
          width: '100%',
          height: '50px',
          backgroundColor: 'secondary',
          borderColor: 'secondary',
          color: 'white',
          marginY: 'auto',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
        }}
        startIcon={buttonSelected ? <CloudUploadIcon /> : <MicIcon />}
      >
        {buttonSelected ? 'Cargar un nuevo audio' : 'Grabar un nuevo audio'}
      </Button>
    </div>
  );
};

// Define PropTypes for the component
NewAudioButton.propTypes = {
  onClick: PropTypes.func.isRequired, // onClick must be a function and is required
  buttonSelected: PropTypes.bool.isRequired, // buttonSelected must be a boolean and is required
};

export default NewAudioButton;