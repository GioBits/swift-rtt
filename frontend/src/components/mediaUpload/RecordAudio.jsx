import { useContext, useMemo, useCallback } from 'react';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { convertWavToMp3 } from '../../utils/audioUtils';
import { MediaContext } from '../../contexts/MediaContext';
import { uploadMediaFile } from '../../service/mediaUploadService';
import { useTimer } from '../../hooks/useTimer';
import '../../index.css';

const RecordAudio = () => {
  const { isRecording, setUploading, setAudioSelected } = useContext(MediaContext);
  const ffmpeg = useMemo(() => new FFmpeg(), []);

  const handleAudioRecorded = useCallback(async (audioBlob) => {
    await ffmpeg.load();
    const mp3File = await convertWavToMp3(ffmpeg, audioBlob);
    await uploadMediaFile(mp3File, setUploading, setAudioSelected);
  }, [ffmpeg, setUploading, setAudioSelected]);

  const { startRecording, stopRecording } = useAudioRecorder(handleAudioRecorded);
  const { elapsedTime, formatTime } = useTimer(isRecording, stopRecording, 30);

  return (
    <div className="h-full w-full flex flex-col m-auto border border-dashed border-gray-400 rounded">
      <IconButton
        onClick={isRecording ? stopRecording : startRecording}
        color="primary"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          '&:hover': {
            backgroundColor: 'transparent',
            '& svg': { opacity: 0.7 },
          },
        }}
        disableRipple
      >
        {isRecording ? (
          <div className="w-full flex justify-center items-center mx-auto gap-2 text-4xl">
            <div className="blinking-circle"></div>
            <span className="timer" style={{ color: 'black' }}>
              {formatTime(elapsedTime)}
            </span>
          </div>
        ) : (
          <MicIcon sx={{ fontSize: '60px', color: 'rgb(220 38 38)' }} />
        )}
        <div className="text-black text-2xl">
          {isRecording ? <p>Detener grabación</p> : <p>Iniciar grabación</p>}
        </div>
      </IconButton>
    </div>
  );
};

export default RecordAudio;
