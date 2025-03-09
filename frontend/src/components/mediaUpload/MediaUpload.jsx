import { useState, useContext } from 'react';
import RecordAudio from './RecordAudio';
import Dropzone from './Dropzone';
import Confirm from './Confirm';
import DisplayAudioWave from './DisplayAudioWave';
import { CircularProgress } from '@mui/material';
import { MediaContext } from '../../contexts/MediaContext';
import MediaUploadSelector from './MediaUploadSelector';
import AudioService from '../../service/audioService';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

const MediaUpload = () => {
  // Access context and state
  const { isUploading, setIsUploading, audioSelected, setAudioSelected, selectedLanguages } = useContext(MediaContext);
  const [buttonSelected, setButtonSelected] = useState(true); // State for selected button (Dropzone or RecordAudio)
  const [isClicked, setIsClicked] = useState(true); // State to track if a button is clicked
  const [fileToUpload, setFileToUpload] = useState(null); // State to store the file to upload
  const [showConfirmation, setShowConfirmation] = useState(false); // State to show/hide confirmation dialog
  const userId = useSelector(state => state.auth.user.id); // Get the user ID from Redux store

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
    setShowConfirmation(true); // Show the confirmation dialog
  };

  const handleNewAudio = () => {
    setAudioSelected({audioData: '', id: ''});
    setFileToUpload(null);
  }

  // Handle confirmation (when the user confirms or cancels the upload)
  const handleConfirmation = async (confirmed) => {

    setShowConfirmation(false); // Hide the confirmation dialog

    if (!confirmed || !fileToUpload) {
      setFileToUpload(null);
      return;
    }

    setIsUploading(true); // Set uploading state to true

    try {

      // Upload the audio file
      const response = await AudioService.uploadAudio(
        fileToUpload,
        selectedLanguages,
        userId
      );

      // Update the selected audio in the context
      setAudioSelected({
        audioData: response.audio_data,
        id: response.id,
      });

      // Process the uploaded audio file
      // const processResponse = await AudioService.processMedia(
      //   userId,
      //   response.id,
      //   selectedLanguages
      // );

      console.log("Audio processing started:", processResponse); // Log the processing response
    } catch (error) {
      console.error("Error uploading or processing the audio: ", error); // Log any errors
    } finally {
      setIsUploading(false); // Set uploading state to false
    }

  };

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

    if(fileToUpload){
      
      let uploadButtom;

      if(audioSelected.id){
        uploadButtom = <>holaaa</>
      }else{
        uploadButtom = <Confirm handleConfirmation={handleConfirmation} file={fileToUpload} />;
      }

      return (<>
        <DisplayAudioWave file={fileToUpload} />;
        {uploadButtom}
      </>)
    }

    if (buttonSelected) {
      return <Dropzone onFileSelected={handleFileSelected} />;
    }

    return <RecordAudio onFileSelected={handleFileSelected} />;
  };

  return (
    <div className='box-border flex flex-col h-full w-full m-auto'>
      {/* Render the MediaUploadSelector component */}
      { fileToUpload ?  // TODO move this buttom to another component
      <Button
        variant={'contained' }
        onClick={ () => handleNewAudio() }
        color='secondary'
        sx={{
          textTransform: 'none',
          width: '90%',
          height: '50px',
          backgroundColor: 'secondary',
          borderColor:'secondary',
          color:'secondary',
          margin: 'auto',
        }}
      >
        Nuevo Audio
      </Button> : 
      <MediaUploadSelector {...props} /> }
      
      {/* Main content area */}
      <div className="box-border w-[90%] m-auto h-full mt-[20px] mb-[20px] flex items-center justify-center">
        <div div className="h-full w-full flex flex-col justify-center items-center border border-dashed border-gray-400 rounded-lg box-border p-4 sm:p-6 md:p-8">
        {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

export default MediaUpload;