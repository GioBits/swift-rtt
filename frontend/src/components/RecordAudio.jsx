import { useContext, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useDispatch } from 'react-redux';
import { handleFileUpload } from '../utils/uploadUtils';
import { clearError } from '../store/slices/errorSlice';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { convertWavToMp3 } from '../utils/audioUtils';
import { MediaContext } from '../contexts/MediaContext';
import '../styles.css';

const RecordAudio = () => {
  const { isRecording, setUploading } = useContext(MediaContext);
  const dispatch = useDispatch();
  const ffmpeg = new FFmpeg();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, isRecording]);

  useEffect(() => {
    let timer;
    if (isRecording) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= 30) {
            stopRecording();
            return 30;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    try {
      await ffmpeg.load();
      const mp3File = await convertWavToMp3(ffmpeg, audioBlob);
      await handleFileUpload(mp3File, '/api/audio', dispatch, "RecordAudio");
    } finally {
      setUploading(false);
    }
  };

  const { startRecording, stopRecording } = useAudioRecorder(dispatch, uploadAudio);

  return (
    <div className="record-container">
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
            '& svg': {
              opacity: 0.7
            }
          }
        }}
      >
        {isRecording
          ?
          <div className="record-status">
            <div className="blinking-circle"></div>
            <span className="timer" style={{ color: 'black' }}>{formatTime(elapsedTime)}</span>
          </div>
          :
          <MicIcon sx={{ fontSize: '60px', color: 'rgb(220 38 38)' }} />
        }
        {isRecording
          ?
          <div className='button-detener'>
            <p>Detener grabación</p>
          </div>
          :
          <p>Iniciar grabación</p>}
      </IconButton>
    </div>
  );
};

export default RecordAudio;
