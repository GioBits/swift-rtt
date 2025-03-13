import { useContext, useEffect, useState } from "react";
import { MediaContext } from '../../contexts/MediaContext';
import MediaContent from "./MediaContent";
import { transcriptionService } from '../../service/transcribeService';
import { translationService } from '../../service/translateService';
import { translatedAudioService } from "../../service/translatedAudioService";
import { b64toBlob } from "../../utils/audioUtils";
import toast from "react-hot-toast";

const MediaResponse = () => {
  const models = [];

  const [resetTimers, setResetTimers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la modal

  const {
    wsResponse,
    transcription,
    setTranscription,
    translate,
    setTranslate,
    audioSelected,
    audioTranslation,
    setAudioTranslation,
    audioUrl,
    setAudioUrl,
    setCurrentStep,
    setIsUploading,
    currentStep, // Obtener el estado currentStep
  } = useContext(MediaContext);

  useEffect(() => {
    const handleResponse = async () => {
      if (audioSelected) {
        setAudioUrl(base64ToUrl(audioSelected.audioData));
        setTranscription("");
        setTranslate("");
        setAudioTranslation("");
        setResetTimers(!resetTimers);
      }
    };
    handleResponse();
  }, [audioSelected]);

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
      setCurrentStep(4);
    }

    if (task === "translate") {
      await fetchTranslationByAudioId(audioId);
      setCurrentStep(5);
    }

    if (task === "generate_audio") {
      await fetchTranslatedAudioByAudioId(audioId);
      setCurrentStep(6);
      setIsUploading(false); // Set uploading state to false
    }
  };

  const fetchTranscriptionByAudioId = async (audioId) => {
    if (audioId === "") return;

    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
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
      setAudioTranslation(base64ToUrl(translatedAudio.audioData));
      toast.success('Audio traducido completado!', { duration: 5000 });
    } catch (error) {
      console.error("Error fetching translated audio:", error);
    }
  };

  const base64ToUrl = (base64) => {
    const blob = b64toBlob(base64, 'audio/mp3');
    return blob ? URL.createObjectURL(blob) : null;
  };

  // Componente de Modal
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-10">
        <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-4xl"
            >
              &times; {/* Icon to close */}
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Botón para mostrar resultados */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={currentStep !== 6}
        className="px-4 py-2 bg-cerulean text-white rounded hover:bg-cerulean/60 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Mostrar Resultados
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-row w-100 lg:w-200 gap-x-10 justify-between p-10">
        <MediaContent
          title="Transcripción"
          contentText={transcription || ""}
          audio={audioUrl || ""}
          models={models}
          placeholder="Esperando audio transcrito..."
          resetTimers={resetTimers}
          tooltipTitle="Reproducir/Detener audio original"
          tooltipDownload="Descargar audio original"
          speed="1"
        />
        <MediaContent
          title="Traducción"
          contentText={translate || ""}
          audio={audioTranslation || ""}
          models={models}
          placeholder="Esperando texto traducido..."
          resetTimers={resetTimers}
          tooltipTitle="Reproducir/Detener audio traducido"
          tooltipDownload="Descargar audio traducido"
          speed="1.25"
        />

        </div>
      </Modal>
    </>
  );
};

export default MediaResponse;