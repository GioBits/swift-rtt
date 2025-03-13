
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import PropTypes from "prop-types"


const MediaUploadSelector = ({isClicked, handleButtonClick, buttonSelected}) => {
  return (
    <div className='box-border flex flex-row space-between h-[80px] m-auto w-[90%] gap-4'>
      <Button
        variant={isClicked && buttonSelected ? 'contained' : 'outlined'}
        onClick={() => handleButtonClick(true)}
        color='secondary'
        sx={{
          textTransform: 'none',
          pointerEvents: isClicked && buttonSelected ? 'none' : 'auto',
          width: '50%',
          height: '50px',
          backgroundColor: isClicked && buttonSelected ? 'secondary' : 'white',
          borderColor: !buttonSelected ? 'secondary' : 'transparent',
          color: !buttonSelected ? 'secondary' : 'white',
          marginY: 'auto'
        }}
        startIcon={<CloudUploadIcon />}
      >
        Subir archivo
      </Button>
      <Button
        variant={isClicked && buttonSelected ? 'outlined' : 'contained'}
        onClick={() => handleButtonClick(false)}
        color='secondary'
        sx={{
          textTransform: 'none',
          pointerEvents: isClicked && buttonSelected === false ? 'none' : 'auto',
          width: '50%',
          height: '50px',
          backgroundColor: isClicked && buttonSelected ? 'white' : 'secondary',
          borderColor: !buttonSelected ? 'transparent' : 'secondary',
          color: !buttonSelected ? 'white' : 'secondary',
          marginY: 'auto'
        }}
        startIcon={<MicIcon />}
      >
        Grabar
      </Button>
    </div>

  )
}

export default MediaUploadSelector

MediaUploadSelector.propTypes = {
  isClicked: PropTypes.bool.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
  buttonSelected: PropTypes.bool.isRequired
};
