import { useContext, useEffect, useCallback } from "react"
import { MediaContext } from '../../contexts/MediaContext'
import MediaText from "./MediaText"
import { transcriptionService } from '../../service/transcribeService';
import { translationService } from '../../service/translateService';

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
    audioSelected } = useContext(MediaContext)
  
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

    const translationResponse = await translationService.getTranscriptionByAudioId(audioId);
    const translationText = translationResponse.translation;
    setTranslate(translationText);
  }, [setTranslate]);

  useEffect(() => {
    if (audioSelected?.id) {
      fetchTranslationByAudioId(audioSelected.id);
    }
  }, [audioSelected, fetchTranslationByAudioId]);


  return (
    <>
      <MediaText title="Transcripción" response={transcription || ""} models={models} />
      <MediaText title="Traducción" response={translate || ""} models={models} />
    </>
  )
}

export default MediaResponse