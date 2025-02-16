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
    transcription,
    setTranscription,
    translate,
    setTranslate,
    audioSelected,
    audioTranslation,
    setAudioTranslation,
    audioUrl } = useContext(MediaContext)

  const fetchTranscriptionByAudioId = useCallback(async (audioId) => {
    if (audioId === "") return;

    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
  }, [setTranscription]);

  useEffect(() => {
    if (audioSelected?.id) {
      fetchTranscriptionByAudioId(audioSelected.id);
    }
  }, [audioSelected, fetchTranscriptionByAudioId]);

  const fetchTranslationByAudioId = useCallback(async (audioId) => {
    if (audioId === "") return;

    const translationResponse = await translationService.getTranslationByAudioId(audioId);
    const translationText = translationResponse.translation;
    setTranslate(translationText);
  }, [setTranslate]);

  useEffect(() => {
    if (audioSelected?.id) {
      fetchTranslationByAudioId(audioSelected.id);
    }
  }, [audioSelected, fetchTranslationByAudioId]);

  
  const fetchTranslatedAudioById = useCallback(async (audioId) => {
    if (!audioId) return;

    try {
      const translatedAudio = await translatedAudioService.getTranslatedAudioById(audioId);
      const blob = b64toBlob(translatedAudio.audioData, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioTranslation(url);
    } catch (error) {
      console.error("Error fetching translated audio:", error);
    }
  }, [setAudioTranslation]);

  useEffect(() => {
    if (audioSelected?.id) {
      fetchTranslatedAudioById(audioSelected.id);
    }
  }, [audioSelected, fetchTranslatedAudioById]);

  return (
    <>
      <MediaText title="Transcripción" response={transcription || ""} audio={audioUrl} models={models} />
      <MediaText title="Traducción" response={translate || ""} audio={audioTranslation} models={models} />
    </>
  )
}

export default MediaResponse