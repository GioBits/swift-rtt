import { MediaContext } from '../contexts/MediaContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import "../styles.css"

const TranslationAudio = () => {
  const { audioUrl, uploading } = useContext(MediaContext);
  const { message, type, origin } = useSelector(state => state.error);

  let validateOrigin = origin === "UploadAudio" || origin === "RecordAudio";
  let color = type === "error" ? "red" : "green";


  return (
    <div className="trasncription-audio">
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
      {uploading && <p>Cargando archivo...</p>}
      {type && message && validateOrigin && (
        <div style={{ color: color }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default TranslationAudio;
