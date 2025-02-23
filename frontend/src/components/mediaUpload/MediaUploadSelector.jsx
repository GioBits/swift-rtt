
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import PropTypes from "prop-types"


const MediaUploadSelector = ({isClicked, handleButtonClick, buttonSelected}) => {
  return (
    <div className='box-border w-full flex flex-row space-between h-[80px] m-auto'>
      <Button
        variant={isClicked && buttonSelected ? 'contained' : 'outlined'}
        onClick={() => handleButtonClick(true)}
        sx={{
          textTransform: 'none',
          pointerEvents: isClicked && buttonSelected ? 'none' : 'auto',
          width: '50%',
          height: '50px',
          backgroundColor: isClicked && buttonSelected ? 'primary' : 'white',
          borderColor: !buttonSelected ? 'primary' : 'transparent',
          color: !buttonSelected ? 'primary' : 'white',
          marginLeft: '20px',
          marginY: 'auto'
        }}
        disabled
        startIcon={<CloudUploadIcon />}
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
          backgroundColor: isClicked && buttonSelected ? 'white' : 'primary',
          borderColor: !buttonSelected ? 'transparent' : 'primary',
          color: !buttonSelected ? 'white' : 'primary',
          marginRight: '20px',
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
