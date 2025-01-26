import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { apiService } from '../service/api';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

const ffmpeg = new FFmpeg();

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const maxRecordingTime = 10000; // 30 seconds
  const minRecordingTime = 3000; // 3 seconds

  const startRecording = () => {

    // Limpiar el estado antes de iniciar una nueva grabación
    setAudioUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    audioChunksRef.current = [];
    startTimeRef.current = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        mediaRecorder.ondataavailable = function(e) {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async function() {

          const endTime = Date.now();
          const duration = endTime - startTimeRef.current;

          if (duration < minRecordingTime) {
            setErrorMessage('La grabación debe durar al menos 3 segundos.');
            setIsRecording(false);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          await uploadAudio(audioBlob);

          // Convert WAV to MP3 using ffmpeg.js
          ///await ffmpeg.load();

          // Limpiar el sistema de archivos virtual de ffmpeg
          // ffmpeg.FS('unlink', 'recording.wav');
          // ffmpeg.FS('unlink', 'recording.mp3');

          // ffmpeg.FS('writeFile', 'recording.wav', await fetchFile(audioBlob));
          // await ffmpeg.run('-i', 'recording.wav', 'recording.mp3');
          // const mp3Data = ffmpeg.FS('readFile', 'recording.mp3');

          // const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });
          // const mp3Url = URL.createObjectURL(mp3Blob);
          // setAudioUrl(mp3Url);
          // await uploadAudio(mp3Blob);

          audioChunksRef.current = [];
        };

        // Detener la grabación automáticamente después de 10 segundos
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxRecordingTime);

      })
      .catch(error => {
        setErrorMessage('Error al acceder al micrófono: ' + error.message);
        console.error('Error al acceder al microfono:', error);
      });
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('uploadedAudio', audioBlob, 'recording.wav');

      const response = await apiService.post('/api/audio', formData);
      setSuccessMessage('Archivo de audio guardado en el servidor.');
      console.log('Archivo de audio guardado en el servidor:', response);
    } catch (error) {
      setErrorMessage('Error al guardar el archivo de audio: ' + error.message);
      console.error('Error al guardar el archivo de audio:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', maxWidth: '600px', margin: '20px auto' }}>
      <h3>Grabar un audio</h3>
      <div>
        {isRecording ? (
          <Button variant='contained' onClick={stopRecording}>Detener Grabación</Button>
        ) : (
          <Button variant='contained' onClick={startRecording}>Iniciar Grabación</Button>
        )}
        {audioUrl && (
          <div style={{ marginTop: 20 }}>
            <audio controls src={audioUrl}></audio>
          </div>
        )}
        {errorMessage && (
          <div style={{ color: 'red', marginTop: 20 }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ color: 'green', marginTop: 20 }}>
            {successMessage}
          </div>
        )}
      </div>
      {uploading && <p>Cargando archivo...</p>} {/* Mensaje de carga */}
    </div>
  );
};

export default RecordAudio;
