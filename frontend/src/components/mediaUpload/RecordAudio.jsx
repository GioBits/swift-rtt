import { useContext, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useDispatch } from 'react-redux';
import { handleFileUpload } from '@utils/uploadUtils';
import { clearError } from '@store/slices/errorSlice';
import { useAudioRecorder } from '@hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { convertWavToMp3 } from '@utils/audioUtils';
import { MediaContext } from '@contexts/MediaContext';
import { b64toBlob } from '@utils/audioUtils';

const RecordAudio = () => {
  const { isRecording, setUploading, setAudioSelected, setAudioUrl } = useContext(MediaContext);
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
      const response = await handleFileUpload(mp3File, '/api/audio');
      setAudioSelected(response);
      const blob = b64toBlob(response.audio_data, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } finally {
      setUploading(false);
    }
  };

  const { startRecording, stopRecording } = useAudioRecorder(dispatch, uploadAudio);

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
            '& svg': {
              opacity: 0.7
            }
          }
        }}
        disableRipple
      >
        {isRecording
          ?
          <div className="w-full flex justify-center items-center mx-auto gap-2 text-4xl">
            <div className="blinking-circle"></div>
            <span className="timer" style={{ color: 'black' }}>{formatTime(elapsedTime)}</span>
          </div>
          :
          <MicIcon sx={{ fontSize: '60px', color: 'rgb(220 38 38)' }} />
        }
        {isRecording ? <p>Detener grabación</p> : <p>Iniciar grabación</p>}
      </IconButton>
    </div>
  );
};

export default RecordAudio;
