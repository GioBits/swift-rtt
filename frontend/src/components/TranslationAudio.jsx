import { TranslationContext } from '../contexts/TranslationContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

const TranslationAudio = () => {
  const { audioUrl, uploading } = useContext(TranslationContext);
  const { message, type, origin } = useSelector(state => state.error);
  return (
    <div className='trascripcion-audio'>
      {audioUrl && (
        <div style={{ marginTop: 20 }}>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {uploading && <p>Cargando archivo...</p>}
      {type === 'error' && message && (origin === "UploadAudio" || origin === "RecordAudio") && (
        <div style={{ color: 'red', marginTop: 20 }}>
          {message}
        </div>
      )}
      {type === "success" && message && (origin === "UploadAudio" || origin === "RecordAudio") && (
        <div style={{ color: "green", marginTop: 20 }}>{message}</div>
      )}
    </div>
  )
}

export default TranslationAudio;
