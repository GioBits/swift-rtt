import { useContext, useEffect, useCallback } from "react"
import { MediaContext } from '../../contexts/MediaContext'
import MediaText from "./MediaText"
import { transcriptionService } from '../../service/transcribeService';
import { translationService } from '../../service/translateService';
import { translatedAudioService } from "../../service/translatedAudioService";
import { b64toBlob } from "../../utils/audioUtils";
import toast from "react-hot-toast";

const MediaResponse = () => {
  const models = [];

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
    setAudioUrl
  } = useContext(MediaContext)

  useEffect(() => {
    const handleResponse = async () => {
      if (audioSelected) {
        setAudioUrl(base64ToUrl(audioSelected.audioData));
        setTranscription("");
        setTranslate("");
        setAudioTranslation("");
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
    }

    if(task === "translate"){
      await fetchTranslationByAudioId(audioId);
    }

    if(task === "generate_audio"){
      await fetchTranslatedAudioByAudioId(audioId);
    }
  } 

  const fetchTranscriptionByAudioId = async (audioId) => {
    if (audioId === "") return;

    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
    toast.success('Transcripción completada!', {duration: 5000});
  };

  const fetchTranslationByAudioId = async (audioId) => {
    if (audioId === "") return;

    const translationResponse = await translationService.getTranslationByAudioId(audioId);
    const translationText = translationResponse.translation;
    setTranslate(translationText);
    toast.success('Traducción completada!',  {duration: 5000});
  };

  const fetchTranslatedAudioByAudioId = async (audioId) => {
    if (!audioId) return;

    try {
      const translatedAudio = await translatedAudioService.getTranslatedAudioByAudioId(audioId);
      setAudioTranslation(base64ToUrl(translatedAudio.audioData));
      toast.success('Audio traducido completado!',  {duration: 5000});
    } catch (error) {
      console.error("Error fetching translated audio:", error);
    }
  };

  const base64ToUrl = (base64) => {
    const blob = b64toBlob(base64, 'audio/mp3');
    return blob ? URL.createObjectURL(blob): null;
  }

  return (
    <>
      <MediaText
        title="Transcripción"
        response={transcription || ""}
        audio={audioUrl || ""}
        models={models}
        placeholder="Esperando audio transcrito..." />
      <MediaText
        title="Traducción"
        response={translate || ""}
        audio={audioTranslation || ""}
        models={models}
        placeholder="Esperando texto traducido..."/>
    </>
  )
}

export default MediaResponse