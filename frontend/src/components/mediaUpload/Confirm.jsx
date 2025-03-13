import { CircularProgress } from '@mui/material'; 
import { useContext } from "react";
import PropTypes from "prop-types";
import AudioService from '../../service/audioService';
import { MediaContext } from '../../contexts/MediaContext';

const Confirm = ({ file, audioId, handleNewAudio }) => {
  const {
    isUploading,
    setIsUploading,
    setFileToUpload,
    setAudioSelected,
    selectedLanguages,
    userId,
    setCurrentStep,
    resetStepper
  } = useContext(MediaContext);

  // Handle confirmation (when the user confirms or cancels the upload)
  const handleConfirmation = async () => {
    if (!file) {
      setFileToUpload(null);
      return;
    }

    resetStepper(2);
    try {
      if (audioId) {
        await processMedia();
      } else {
        await uploadMedia();
      }
    } catch (error) {
      console.error("Error uploading or processing the audio: ", error); // Log any errors
    }
  };

  const uploadMedia = async () => {
    setIsUploading(true); // Set uploading state to true
    // Upload the audio file
    const response = await AudioService.uploadAudio(
      file,
      selectedLanguages,
      userId
    );

    // Update the selected audio in the context
    setAudioSelected({
      audioData: response.audio_data,
      id: response.id,
    });

    setCurrentStep(2);
    setIsUploading(false);
    console.log("Audio uploaded"); // Log the processing response
  };

  const processMedia = async () => {
    setIsUploading(true);
    // Force re-render to clear the media response
    setAudioSelected((prev) => ({ ...prev }));

    // Process the uploaded audio file
    const processResponse = await AudioService.processMedia(
      userId,
      audioId,
      selectedLanguages
    );

    setCurrentStep(3);
    console.log("Audio processing", processResponse); // Log the processing response
  };

  return (
    <div className="mt-4 flex w-72">
      {/* Flexible container for buttons */}
      <div className={`flex ${audioId ? "justify-center" : "justify-end"} w-full`}>
        {/* Cancel button (only shown if there's no audioId) */}
        {!audioId && (
          <button
            onClick={() => handleNewAudio()}
            className="mr-2 w-1/2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
          >
            Cancelar
          </button>
        )}

        {/* Main button (Upload Audio or Process Audio) */}
        <button
          onClick={() => handleConfirmation()}
          className={`px-4 py-2 ${audioId ? "w-1/2" : "w-1/2"
            } bg-cerulean text-white rounded hover:bg-cerulean/60 hover:cursor-pointer`}
        >
          {isUploading ? ( // Show CircularProgress is isUPloading true
            <CircularProgress size={20} color="inherit" />
          ) : (
            audioId ? "Procesar Audio" : "Subir Audio" // Show text button is isUploading false
          )}
        </button>
      </div>
    </div>
  );
};

// Define PropTypes for the component
Confirm.propTypes = {
  file: PropTypes.object, // File to upload (can be null or undefined)
  audioId: PropTypes.string, // ID of the audio to process (optional)
  handleNewAudio: PropTypes.func.isRequired, // Function to handle new audio action
};

export default Confirm;