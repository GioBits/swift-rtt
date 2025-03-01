import { useState, useContext, useMemo, useCallback } from 'react';
import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { convertWavToMp3 } from '../../utils/audioUtils';
import { MediaContext } from '../../contexts/MediaContext';
import { uploadMediaFile } from '../../service/mediaUploadService';
import { useTimer } from '../../hooks/useTimer';
import '../../index.css';

const RecordAudio = () => {
  const { isRecording, setUploading, setAudioSelected, selectedLanguages} = useContext(MediaContext);
  const ffmpeg = useMemo(() => new FFmpeg(), []);
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(3);

  const handleAudioRecorded = useCallback(
    async (audioBlob) => {
      await ffmpeg.load();
      const mp3File = await convertWavToMp3(ffmpeg, audioBlob);
      await uploadMediaFile(mp3File, setUploading, setAudioSelected, selectedLanguages);
    },
    [ffmpeg, setUploading, setAudioSelected]
  );

  const { startRecording, stopRecording } = useAudioRecorder(handleAudioRecorded);
  const { elapsedTime, formatTime } = useTimer(isRecording, stopRecording, 30);

  const handleStart = () => {
    setIsPreparing(true);
    setPrepCountdown(5);

    const countdownInterval = setInterval(() => {
      setPrepCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsPreparing(false);
          startRecording();
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center border border-dashed border-gray-400 rounded-lg box-border p-4 sm:p-6 md:p-8">
      <div className="h-3/4 w-full flex flex-col justify-center items-center">
        {isPreparing ? (
          <div className="p-5 text-center text-base sm:text-md md:text-lg text-black animate-pulse">
            <p>
              <b className="text-primary font-extrabold">Por favor, acércate al micrófono</b>
            </p>
            <p className="text-4xl mt-4 text-black">{prepCountdown}</p>
          </div>
        ) : isRecording ? (
          <div className="w-full flex justify-center items-center mx-auto gap-2 text-4xl">
            <div className="blinking-circle"></div>
            <span className="timer text-[4rem]" style={{ color: 'black' }}>
              {formatTime(elapsedTime)}
            </span>
          </div>
        ) : (
          <>
            <p className="text-base sm:text-md md:text-lg text-center mx-2">
              Presiona el botón <b className='font-bold'>iniciar</b> para <br />
              <b className="text-blueMetal font-extrabold">grabar audio</b>
            </p>
            <span className="leading-[1.2] block mt-4 text-slate-500 whitespace-pre-wrap text-xs">
              El tiempo máximo de grabación es de 30 segundos.
            </span>
          </>
        )}
      </div>

      <Button
        startIcon={isRecording ? <StopIcon /> : <PlayArrowIcon />}
        variant="contained"
        color='secondary'
        sx={{
          width: '50%',
          backgroundColor: isRecording ? 'gray' : undefined,
          '&:hover': {
            backgroundColor: isRecording ? '#6b7280' : undefined,
          },
        }}
        disabled={isPreparing}
        onClick={isRecording ? stopRecording : handleStart}
      >
        {isPreparing ? 'Preparando...' : isRecording ? 'Detener' : 'Iniciar'}
      </Button>
    </div>
  );
};

export default RecordAudio;
