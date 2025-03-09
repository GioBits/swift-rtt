import { useContext } from "react";
import AudioService from '../../service/audioService';
import { MediaContext } from '../../contexts/MediaContext';

const Confirm = ({ file, audioId, handleNewAudio }) => {

  const { setIsUploading, setFileToUpload, audioSelected, setAudioSelected, selectedLanguages, userId } = useContext(MediaContext);

  // Handle confirmation (when the user confirms or cancels the upload)
  const handleConfirmation = async () => {

    if (!file) {
      setFileToUpload(null);
      return;
    }

    setIsUploading(true); // Set uploading state to true

    try {

      if(audioId){
        await processMedia()
      } else {
        await uploadMedia();
      }
      
    } catch (error) {
      console.error("Error uploading or processing the audio: ", error); // Log any errors
    } finally {
      setIsUploading(false); // Set uploading state to false
    }

  };

  const uploadMedia = async () => {
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

    console.log("Audio uploaded"); // Log the processing response
  }

  const processMedia = async () => {

    // Force re-render to clear the media reponse
    setAudioSelected((prev) => ({ ...prev }));

    // Process the uploaded audio file
    const processResponse = await AudioService.processMedia(
      userId,
      audioId,
      selectedLanguages
    );

    console.log("Audio processing", processResponse); // Log the processing response
  }

  return (       //TODO Mejorar el manejo del audioid para mostrar el boton de procesar audio
    <div className="mt-4 flex justify-end">
        {!audioId ? (<button
          onClick={() => handleNewAudio()}
          className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
        >
          Cancel
        </button>) : null}
        <button
          onClick={() => handleConfirmation()}
          className="px-4 py-2 bg-cerulean text-white rounded hover:bg-cerulean/60 hover:cursor-pointer"
        >
          {audioId ? "Procesar Audio" : "Subir Audio"}
        </button>
    </div>
  );
};

export default Confirm;