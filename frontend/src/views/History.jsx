import { useEffect, useState } from 'react';
import MediaUploadHistory from '../components/MediaUploadHistory';
import audioService from '../service/audioService';
import { useSelector } from 'react-redux';
import FormatUtils from '../utils/FormatUtils';
import NavbarComponent from '../components/NavbarComponent';
import Modal from "../components/mediaResponse/ModalResponse";
import MediaContent from "../components/mediaResponse/MediaContent";
import { transcriptionService } from '../service/transcribeService';
import { translationService } from '../service/translateService';
import { translatedAudioService } from '../service/translatedAudioService';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [mediaTranslation, setMediaTranslation] = useState("");
  const userId = useSelector(state => state.auth.user.id);

  const languageMap = { 1: 'English', 2: 'Spanish', 3: 'Italian', 4: 'Chinese' };

  useEffect(() => {
    const fetchAudiosByUserId = async () => {
      if (!userId) return;
      try {
        const audiosResponse = await audioService.getAudiosByUserId(userId);
        const rows = audiosResponse.map(audio => ({
          id: audio.id,
          name: FormatUtils.removeExtension(audio.filename),
          size: FormatUtils.formatFileSize(audio.file_size),
          language: languageMap[audio.language_id],
          date: FormatUtils.formatDateWithLeadingZeros(audio.created_at),
          time: FormatUtils.formatTimeWithLeadingZeros(audio.created_at),
        }));
        setHistoryData(rows);
      } catch (error) {
        console.error("Error obteniendo audios:", error);
      }
    };

    fetchAudiosByUserId();
  }, [userId]);

  const b64toBlob = (b64Data, contentType = 'audio/mp3') => {
    try {
      const byteCharacters = atob(b64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      return URL.createObjectURL(new Blob([byteArray], { type: contentType }));
    } catch (error) {
      console.error("Error convirtiendo base64 a Blob:", error);
      return null;
    }
  };

  const onRowClick = async (row) => {
    if (!row.id) return;
    setIsModalOpen(true);

    try {
      const audioResponse = await audioService.getAudioById(row.id);
      setSelectedAudio(b64toBlob(audioResponse.audio_data));
      console.log(audioResponse.audio_data);

      const transcriptionResponse = await transcriptionService.getTranscriptionByAudioId(row.id);
      setTranscription(transcriptionResponse.transcription);

      const translationResponse = await translationService.getTranslationByAudioId(row.id);
      setTranslation(translationResponse.translation);

      const translatedAudioResponse = await translatedAudioService.getTranslatedAudioByAudioId(row.id);
      setMediaTranslation(b64toBlob(translatedAudioResponse.audioData));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  return (
    <div className="w-screen h-screen">
      <NavbarComponent />
      <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 lg:flex mt-10 m-auto block">
        <MediaUploadHistory rows={historyData} onRowClick={onRowClick} />
      </div>
      {isModalOpen && selectedAudio && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col md:flex-row w-full gap-x-10 justify-between">
            <MediaContent
              title="Transcripción"
              contentText={transcription || ""}
              audio={selectedAudio || ""}
              tooltipTitle="Reproducir/Detener audio original"
              tooltipDownload="Descargar audio original"
            />
            <MediaContent
              title="Traducción"
              contentText={translation || ""}
              audio={mediaTranslation || ""}
              tooltipDownload="Descargar audio traducido"
              speed="1.25"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default History;