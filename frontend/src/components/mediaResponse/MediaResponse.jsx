import { useContext, useEffect, useCallback } from "react"
import { MediaContext } from '../../contexts/MediaContext'
import MediaText from "./MediaText"
import { transcriptionService } from '../../service/transcribeService';
import { translationService } from '../../service/translateService';
import { translatedAudioService } from "../../service/translatedAudioService";
import { b64toBlob } from "../../utils/audioUtils";

const MediaResponse = () => {
  const models = [
    { id: "1", name: "Modelo 1" },
    { id: "2", name: "Modelo 2" },
    { id: "3", name: "Modelo 3" },
  ];

  const {
    wsResponse,
    transcription,
    setTranscription,
    translate,
    setTranslate,
    audioSelected,
    audioTranslation,
    setAudioTranslation,
    audioUrl 
  } = useContext(MediaContext)

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

    if(task === "transcribe"){
      await fetchTranslationByAudioId(audioId);
    }

    if(task === "generate_audio"){
      await fetchTranslatedAudioById(audioId);
    }
  } 

  const fetchTranscriptionByAudioId = async (audioId) => {
    if (audioId === "") return;

    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
  };

  const fetchTranslationByAudioId = async (audioId) => {
    if (audioId === "") return;

    const translationResponse = await translationService.getTranslationByAudioId(audioId);
    const translationText = translationResponse.translation;
    setTranslate(translationText);
  };

  const fetchTranslatedAudioById = async (audioId) => {
    if (!audioId) return;

    try {
      const translatedAudio = await translatedAudioService.getTranslatedAudioByAudioId(audioId);
      const blob = b64toBlob(translatedAudio.audioData, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioTranslation(url);
    } catch (error) {
      console.error("Error fetching translated audio:", error);
    }
  };

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