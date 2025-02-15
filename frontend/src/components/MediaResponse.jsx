import { useContext, useEffect } from "react"
import { MediaContext } from "../contexts/MediaContext"
import MediaText from "./MediaText"
import { transcriptionService } from '../service/transcribeService';

const MediaResponse = () => {
  const models = [
    { id: "1", name: "Modelo 1" },
    { id: "2", name: "Modelo 2" },
    { id: "3", name: "Modelo 3" },
  ];
  const { transcription, setTranscription,translate, audioSelected } = useContext(MediaContext)

  useEffect(() => {
    fetchTranscriptionByAudioId(audioSelected.id);
  },[audioSelected])

  const fetchTranscriptionByAudioId = async (audioId) => {
    if(audioId === "") return;
    
    const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(audioId);
    const transcriptionText = transcriptionResponse.transcription;
    setTranscription(transcriptionText);
  }

  return (
    <>
      <MediaText title="Transcripción" response={transcription || ""} models={models} />
      <MediaText title="Traducción" response={translate || ""} models={models} />
    </>
  )
}

export default MediaResponse