import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

const MediaContent = ({
  title,
  contentText,
  audio = null,
  placeholder,
  resetTimers,
  tooltipTitle,
  tooltipDownload,
  speed,
}) => {
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(parseFloat(speed));
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDuration(0);
    setCurrentTime(0);
  }, [resetTimers]);

  const formatTime = (time) => {
    if (isNaN(time)) { return "00:00"; }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

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

  const increaseSpeed = () => {
    setPlaybackRate((prev) => Math.min(prev + 0.25, 2.0));
  };

  const decreaseSpeed = () => {
    setPlaybackRate((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleCopyText = () => {
    if (contentText) {
      navigator.clipboard.writeText(contentText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch((error) => {
          console.error("Error al copiar el texto:", error);
        });
    }
  };

  return (
    <div className="bg-white w-full h-1/2 p-5 rounded-lg shadow-lg shadow-blueMetal/50">
      <div className="w-full flex flex-col h-[80px] box-border">
        <div className="bg-cerulean flex w-full h-[60px] rounded m-auto">
          <div className="m-auto text-3xl text-white">{title}</div>
        </div>
      </div>

      <div className="h-[calc(100%-120px)] box-border">
        <div className="w-full h-full p-4 border border-dashed border-gray-600 box-border rounded max-h-full overflow-y-auto">
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

      <div className="h-[50px] flex flex-row w-full">
        <div className="m-auto ml-0 flex gap-7">

          <Tooltip title={tooltipTitle} arrow>
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
                    onProgress={(progress) => { setCurrentTime(progress.playedSeconds); }}
                    onDuration={setDuration}
                    playbackRate={playbackRate}
                  />
                )}
                <VolumeUpIcon />
              </IconButton>
            </span>
          </Tooltip>

          <div className={`flex items-center text-gray-600 ${audio ? 'opacity-100' : 'opacity-50'}`}>
            <span className="font-mono">
              <Tooltip title="Tiempo reproducido/Duración" arrow>
                <span className="font-mono">
                  {formatTime(currentTime)}/{formatTime(duration)}
                </span>
              </Tooltip>
            </span>
          </div>

          <div className="flex w-[124px] justify-between">
            <Tooltip title="Disminuir velocidad" arrow>
              <span>
                <IconButton
                  onClick={decreaseSpeed}
                  disabled={!audio || playbackRate <= 0.75}
                  sx={{
                    opacity: audio ? 1 : 0.5,
                    cursor: audio ? 'pointer' : 'not-allowed',
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </span>
            </Tooltip>

            <div className={`flex items-center text-gray-600 ${audio ? 'opacity-100' : 'opacity-50'}`}>
              <Tooltip title="Velocidad de reproducción">
                <span className="font-mono">{playbackRate}x</span>
              </Tooltip>
            </div>

            <Tooltip title="Aumentar velocidad" arrow>
              <span>
                <IconButton
                  onClick={increaseSpeed}
                  disabled={!audio || playbackRate >= 2.0}
                  sx={{
                    opacity: audio ? 1 : 0.5,
                    cursor: audio ? 'pointer' : 'not-allowed',
                  }}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          <Tooltip title={copied ? "¡Copiado!" : "Copiar texto"} arrow>
            <span>
              <IconButton
                onClick={handleCopyText}
                disabled={!contentText}
                sx={{
                  opacity: contentText ? 1 : 0.5,
                  cursor: contentText ? 'pointer' : 'not-allowed',
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={tooltipDownload} arrow>
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
        </div>
      </div>
    </div>
  );
};

export default MediaContent;

MediaContent.propTypes = {
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  audio: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  resetTimers: PropTypes.any,
  tooltipTitle: PropTypes.string,
  tooltipDownload: PropTypes.string,
  speed: PropTypes.string.isRequired,
};