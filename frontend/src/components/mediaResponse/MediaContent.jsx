import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

/**
 * `MediaContent` component to display a title, text content (like transcription or translation),
 * and audio with playback and download controls.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display at the top of the component.
 * @param {string} props.contentText - The textual content (transcription or translation) to display.
 * @param {Array} props.models - List of available models. Each model has an `id` and `name`.
 * @param {string|null} props.audio - The URL of the audio file to play. If `null`, no audio controls will be shown.
 * @param {string} props.placeholder - Placeholder text to show when there is no content available or while it's loading.
 * 
 * @returns {JSX.Element} The component rendering interactive multimedia content.
 */
const MediaContent = ({ title, contentText, audio = null, placeholder }) => {
  
  const [playing, setPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (time) => {
    if (isNaN(time)) {return "00:00";}
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const togglePlayback = () => {
    setPlaying((prev) => !prev);
  };

  const handleDownload = () => {
    if (!audio) return;
    const link = document.createElement("a");
    link.href = audio;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute("download", `audio-${timestamp}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white w-full h-1/2 p-5 rounded-lg">
      <div className="w-full flex flex-col h-[80px] box-border">
        <div className="bg-primary flex w-full h-[60px] rounded m-auto">
          <div className="m-auto text-3xl text-white">{title}</div>
        </div>
      </div>

      <div className="h-[calc(100%-120px)] box-border">
        <div className="w-full h-full p-4 border border-dashed border-gray-600 box-border rounded shadow-lg max-h-full overflow-y-auto">
          {contentText ? (
            <Typewriter
              options={{
                strings: contentText,
                autoStart: true,
                loop: false,
                delay: 12,
                cursor: "",
              }}
            />
          ) : (
            <div className="text-slate-500 whitespace-pre-wrap text-3xl">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      <div className="h-[50px] flex flex-row">
        <div className="m-auto mr-5 flex gap-3">
          <Tooltip title="Reproducir/Detener audio" arrow>
            <span>
              <IconButton
                onClick={togglePlayback}
                disabled={!audio}
                sx={{
                  opacity: audio ? 1 : 0.5,
                  cursor: audio ? 'pointer' : 'not-allowed',
                }}
              >
                {audio && (
                  <ReactPlayer
                    url={audio}
                    playing={playing}
                    controls={false}
                    width="0"
                    height="0"
                    className="hidden"
                    onEnded={() => setPlaying(false)}
                    onProgress={({currentTime}) => setCurrentTime(currentTime)}
                    onDuration={setDuration}

                  />
                )}
                <VolumeUpIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Descargar audio" arrow>
            <span>
              <IconButton
                onClick={handleDownload}
                disabled={!audio}
                sx={{
                  opacity: audio ? 1 : 0.5,
                  cursor: audio ? 'pointer' : 'not-allowed',
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          {/*Mostrar tiempo de reproduccion*/}
          <div className="ml-4 flex items-center text-gray-600">
            <span className="font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaContent;

MediaContent.propTypes = {
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  models: PropTypes.array.isRequired,
  audio: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};
