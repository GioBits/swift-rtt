import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';

const RecordAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
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

        mediaRecorder.onstop = function() {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');

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
  );
};

export default RecordAudio;
