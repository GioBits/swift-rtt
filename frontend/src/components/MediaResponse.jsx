import { useContext } from "react"
import { MediaContext } from "../contexts/MediaContext"
import MediaText from "./MediaText"

const MediaResponse = () => {
  const models = [
    { id: "1", name: "Modelo 1" },
    { id: "2", name: "Modelo 2" },
    { id: "3", name: "Modelo 3" },
  ];
  const { transcription, translate } = useContext(MediaContext)
  return (
    <>
      <MediaText title="Transcripción" response={transcription || ""} models={models} />
      <MediaText title="Traducción" response={translate || ""} models={models} />
    </>
  )
}

export default MediaResponse