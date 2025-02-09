import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { handleFileUpload } from '../utils/uploadUtils';
import { clearError } from '../store/slices/errorSlice';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { convertWavToMp3 } from '../utils/audioUtils';
import { TranslationContext } from '../contexts/TranslationContext';
import '../styles.css';

const RecordAudio = () => {
  const { isRecording, setUploading } = useContext(TranslationContext);
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
        setElapsedTime(prevTime => prevTime + 1);
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
      <div className="record-status">
        {isRecording && (
          <>
            <div className="blinking-circle"></div>
            <span className="timer">{formatTime(elapsedTime)}</span>
          </>
        )}
      </div>
      <Button variant="contained" onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
      </Button>
    </div>
  );
};

export default RecordAudio;
