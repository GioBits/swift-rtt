import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

const ffmpeg = new FFmpeg();

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
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
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          // Convert WAV to MP3 using ffmpeg.js
          if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
          }
          ffmpeg.FS('writeFile', 'recording.wav', await fetchFile(audioBlob));
          await ffmpeg.run('-i', 'recording.wav', 'recording.mp3');
          const mp3Data = ffmpeg.FS('readFile', 'recording.mp3');

          const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });
          const mp3Url = URL.createObjectURL(mp3Blob);
          setAudioUrl(mp3Url);

          const formData = new FormData();
          formData.append('audio', mp3Blob, 'recording.mp3');

          fetch('/upload', {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => {
            console.log('Archivo de audio guardado en el servidor:', data);
          })
          .catch(error => {
            console.error('Error al guardar el archivo de audio:', error);
          });
          audioChunksRef.current = [];
        };
      })
      .catch(error => {
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
      </div>
      {uploading && <p>Cargando archivo...</p>} {/* Mensaje de carga */}
    </div>
  );
};

export default RecordAudio;
