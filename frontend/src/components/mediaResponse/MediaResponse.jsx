import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { MediaContext } from '../../contexts/MediaContext';
import MediaContent from "./MediaContent";
import { transcriptionService } from '../../service/transcribeService';
import { translationService } from '../../service/translateService';
import { translatedAudioService } from "../../service/translatedAudioService";
import { b64toBlob } from "../../utils/audioUtils";
import Modal from "./ModalResponse";
import toast from "react-hot-toast";

const MediaResponse = () => {
  const models = [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    wsResponse,
    transcription,
    setTranscription,
    translate,
    setTranslate,
    setCurrentStep,
    setIsUploading,
    mediaSelected,
    mediaTranslation,
    setMediaTranslation,
    mediaUrl,
    setMediaUrl,
    currentStep
  } = useContext(MediaContext);

  useEffect(() => {
    const handleResponse = async () => {
      if (mediaSelected) {
        setMediaUrl(base64ToUrl(mediaSelected.data));
        setTranscription("");
        setTranslate("");
        setMediaTranslation("");
      }
    };
    handleResponse();
  }, [mediaSelected]);

  useEffect(() => {
    const handleResponse = async () => {
      if (wsResponse) {
        await handleWsResponse(wsResponse);
      }
    };
    handleResponse();
  }, [wsResponse]);

  const handleWsResponse = async (wsResponse) => {
    let wsResponseData = JSON.parse(wsResponse);
    let audioId = wsResponseData.audio_id;
    let task = wsResponseData.task;
    if (task === "transcribe") {
      await fetchTranscriptionByAudioId(audioId);
      if (currentStep == 3) setCurrentStep(4);
    }

    if (task === "translate") {
      await fetchTranslationByAudioId(audioId);
      if (currentStep == 4) setCurrentStep(5);
      
    }

    if (task === "generate_audio") {
      await fetchTranslatedAudioByAudioId(audioId);
      if(currentStep == 5) setCurrentStep(6);
      
      setIsUploading(false);
    }
  };

  const fetchTranscriptionByAudioId = async (audioId) => {
    if (audioId === "") return;

    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
    setIsModalOpen(true);
    toast.success('Transcripción completada!', { duration: 5000 });
  };

  const fetchTranslationByAudioId = async (audioId) => {
    if (audioId === "") return;

    const translationResponse = await translationService.getTranslationByAudioId(audioId);
    const translationText = translationResponse.translation;
    setTranslate(translationText);
    toast.success('Traducción completada!', { duration: 5000 });
  };

  const fetchTranslatedAudioByAudioId = async (audioId) => {
    if (!audioId) return;

    try {
      const translatedAudio = await translatedAudioService.getTranslatedAudioByAudioId(audioId);
      setMediaTranslation(base64ToUrl(translatedAudio.audioData));
      toast.success('Audio traducido completado!', { duration: 5000 });
    } catch (error) {
      console.error("Error fetching translated audio:", error);
    }
  };

  const base64ToUrl = (base64) => {
    const blob = b64toBlob(base64, 'audio/mp3');
    return blob ? URL.createObjectURL(blob) : null;
  };

  return (
    <>
      {/* Button to show results */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={currentStep < 4}
        className="px-4 py-2 w-[180px] bg-cerulean text-white rounded hover:bg-cerulean/60 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Mostrar Resultados
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col md:flex-row w-full gap-x-10 justify-between">
          <MediaContent
            title="Transcripción"
            contentText={transcription || ""}
            audio={mediaUrl || ""}
            models={models}
            tooltipTitle="Reproducir/Detener audio original"
            tooltipDownload="Descargar audio original"
          />
          <MediaContent
            title="Traducción"
            contentText={translate || ""}
            audio={mediaTranslation || ""}
            models={models}
            tooltipDownload="Descargar audio traducido"
            speed="1.25"
          />
        </div>
      </Modal>
    </>
  );
};

export default MediaResponse;